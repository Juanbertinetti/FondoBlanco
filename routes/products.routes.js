import express from 'express';

const router = express.Router();

router.get('/products', (req, res) => {
    const query = 'SELECT id, nombre, precio, categoria, descripcion, imagen_url FROM productos';
    req.db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ status: false, error: 'Error al obtener los productos' });
        }
        res.json({ status: true, products: results });
    });
});

export default router;