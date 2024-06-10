import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET = "_AQPsssHV56kFO7ImQL9DPEj5UzCYuLGB8bSAmedv74gLPueV9abm51Ca18rIGJC";

router.post('/addToCart', async (req, res) => {
    const { token, product } = req.body;
    const connection = req.db;

    try {
        const decoded = jwt.verify(token, SECRET);

        req.db.query('INSERT INTO cart (user_id, product_name, price, quantity) VALUES (?, ?, ?, ?)',
            [decoded.id, product.name, product.price, product.quantity], (error, results) => {
                if (error) {
                    console.error('Error al agregar el producto al carrito en la base de datos:', error);
                    res.status(500).json({ status: false, message: "Error de servidor" });
                    return;
                }
                res.status(200).json({ status: true, message: "Producto agregado al carrito exitosamente" });
            });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, message: "Token inválido o error al agregar el producto al carrito" });
    }
});

export default router;