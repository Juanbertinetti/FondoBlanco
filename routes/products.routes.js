// En products.routes.js
import express from 'express';
const router = express.Router();

// En products.routes.js
router.get('/products', (req, res) => {
    const categoria_id = req.query.categoria_id;
    const query = categoria_id
        ? 'SELECT id, nombre, precio, descripcion, imagen_url FROM productos WHERE categoria_id = ?'
        : 'SELECT id, nombre, precio, descripcion, imagen_url FROM productos';

    const queryParams = categoria_id ? [categoria_id] : [];

    req.db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send({ status: false, error: 'Error al obtener los productos' });
        }
        console.log('Resultados de la consulta:', results);
        res.json({ status: true, products: results });
    });
});

export default router;