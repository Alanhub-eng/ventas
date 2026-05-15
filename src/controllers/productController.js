const { products } = require("../models/productModel");
const { randomUUID } = require("crypto");

const createProduct = (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "No autorizado" });
    }

    const { title, description, price } = req.body;

    if (!title || !description || !price) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (price <= 0) {
        return res.status(400).json({ message: "Precio inválido" });
    }

    // ✅ Fix 1: ahora tiene id
    products.push({ id: randomUUID(), title, description, price });

    res.json({ message: "Producto creado" });
};

const getProducts = (req, res) => {
    res.json(products);
};

// ✅ Fix 2: nueva función para borrar
const deleteProduct = (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "No autorizado" });
    }

    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    products.splice(index, 1);
    res.json({ message: "Producto eliminado" });
};

module.exports = { createProduct, getProducts, deleteProduct };