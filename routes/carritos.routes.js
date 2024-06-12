import express from 'express';
const router = express.Router();

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const { userId } = req.body;
    const query = 'INSERT INTO carritos (userId) VALUES (?)';

    req.db.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el carrito' });
        }
        res.status(201).json({ cartId: result.insertId });
    });
});

// Agregar un producto al carrito
router.post('/:cartId/items', (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;
    const query = 'INSERT INTO carrito_items (cartId, productId, quantity) VALUES (?, ?, ?)';

    req.db.query(query, [cartId, productId, quantity], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        }
        res.status(200).json({ message: 'Producto agregado al carrito' });
    });
});

// Obtener los productos del carrito
router.get('/:cartId/items', (req, res) => {
    const cartId = req.params.cartId; // Asegurémonos de obtener el cartId correctamente
    const query = `
        SELECT p.*, ci.quantity 
        FROM productos p
        JOIN cart_items ci ON p.id = ci.product_id
        WHERE ci.cart_id = ?
    `;

    req.db.query(query, [cartId], (err, results) => {
        if (err) {
            console.error('Error al obtener los productos del carrito:', err);
            return res.status(500).json({ error: 'Error al obtener los productos del carrito', details: err.message });
        }
        res.status(200).json(results);
    });
});

// Eliminar un producto del carrito
router.delete('/:cartId/items/:itemId', (req, res) => {
    const { cartId, itemId } = req.params;
    const query = 'DELETE FROM carrito_items WHERE cartId = ? AND productId = ?';

    req.db.query(query, [cartId, itemId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
        }
        res.status(200).json({ message: 'Producto eliminado del carrito' });
    });
});

// Eliminar el carrito
router.delete('/:cartId', (req, res) => {
    const { cartId } = req.params;
    const query = 'DELETE FROM carritos WHERE id = ?';

    req.db.query(query, [cartId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el carrito' });
        }
        res.status(200).json({ message: 'Carrito eliminado' });
    });
});

export default router;