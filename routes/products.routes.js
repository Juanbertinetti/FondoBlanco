import express from 'express';

const router = express.Router();

router.get('/products', (req, res) => {
    const query = 'SELECT id, nombre, precio, descripcion, imagen_url FROM productos WHERE categoria_id = 2';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send({ status: false, error: 'Error al obtener los productos' });
        }
        console.log('Resultados de la consulta:', results);
        res.json({ status: true, products: results });
    });
});

router.get('/products/vinos', (req, res) => {
    const query = 'SELECT id, nombre, precio, descripcion, imagen_url FROM productos WHERE categoria_id = 3';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send({ status: false, error: 'Error al obtener los productos' });
        }
        console.log('Resultados de la consulta:', results);
        res.json({ status: true, products: results });
    });
});

router.get('/products/espumantes', (req, res) => {
    const query = 'SELECT id, nombre, precio, descripcion, imagen_url FROM productos WHERE categoria_id = 4';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send({ status: false, error: 'Error al obtener los productos' });
        }
        console.log('Resultados de la consulta:', results);
        res.json({ status: true, products: results });
    });
});

router.get('/products/gaseosas', (req, res) => {
    const query = 'SELECT id, nombre, precio, descripcion, imagen_url FROM productos WHERE categoria_id = 5';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send({ status: false, error: 'Error al obtener los productos' });
        }
        console.log('Resultados de la consulta:', results);
        res.json({ status: true, products: results });
    });
});

router.get('/products/cervezas', (req, res) => {
    const query = 'SELECT id, nombre, precio, descripcion, imagen_url FROM productos WHERE categoria_id = 6';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send({ status: false, error: 'Error al obtener los productos' });
        }
        console.log('Resultados de la consulta:', results);
        res.json({ status: true, products: results });
    });
});

export default router;