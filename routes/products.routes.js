import { Router } from 'express';

const router = Router();

router.get('/products', (req, res) => {
    const connection = req.db;

    connection.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            console.error('Error al obtener los productos:', error);
            return res.status(500).json({ status: false, message: 'Error al obtener los productos' });
        }

        res.status(200).json({ status: true, products: results });
    });
});

export default router;