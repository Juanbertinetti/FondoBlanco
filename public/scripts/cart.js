async function createCart(userId) {
    const response = await fetch('/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    });
    const data = await response.json();
    return data.cartId;
}

async function addToCart(cartId, productId, quantity) {
    const response = await fetch(`/carrito/${cartId}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
    });
    const data = await response.json();
    return data.cartItemId;
}

async function getCartItems(cartId) {
    const response = await fetch(`/carrito/${cartId}/items`);
    const data = await response.json();
    return data;
}