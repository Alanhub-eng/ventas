const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.send("Servidor funcionando 🚀");
});

app.listen(4000, () => {
    console.log("Servidor en http://localhost:4000");
});

const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend/public")));