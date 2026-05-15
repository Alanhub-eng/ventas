const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../models/userModel");

const register = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        password: hashedPassword,
        role
    });

    res.json({ message: "Usuario creado" });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
        {
            username: user.username,
            role: user.role
        },
        "secreto"
    );

    res.json({ token });
};

module.exports = { register, login };