let cart = [];

function initializeCart() {
    const cartIcon = document.querySelector('.container-cart-icon');
    const cartContainer = document.querySelector('.container-cart-products');
    const productCount = document.getElementById('contador-productos');
    const cartTotal = document.querySelector('.total-pagar');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartRows = document.querySelector('.row-product');
    const cartTotalContainer = document.querySelector('.cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    cartIcon.addEventListener('click', () => {
        cartContainer.classList.toggle('hidden-cart');
    });

    checkoutButton.addEventListener('click', () => {
        showCheckoutSummary();
    });

    function addToCart(product) {
        const productIndex = cart.findIndex(item => item.title === product.title);

        if (productIndex !== -1) {
            cart[productIndex].quantity += 1;
        } else {
            cart.push({
                title: product.title,
                price: parseFloat(product.price), // Asegúrate de convertir el precio a número
                quantity: 1
            });
        }

        updateCart();
    }

    function removeFromCart(productTitle) {
        cart = cart.filter(product => product.title !== productTitle);
        updateCart();
    }

    function updateCart() {
        cartRows.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartEmpty.classList.remove('hidden');
            cartTotalContainer.classList.add('hidden');
        } else {
            cartEmpty.classList.add('hidden');
            cartTotalContainer.classList.remove('hidden');

            cart.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('cart-product');
                productElement.innerHTML = `
                    <div class="info-cart-product">
                        <span class="cantidad-producto-carrito">${product.quantity}</span>
                        <p class="titulo-producto-carrito">${product.title}</p>
                        <span class="precio-producto-carrito">$${(product.quantity * product.price).toFixed(2)}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                `;

                productElement.querySelector('.icon-close').addEventListener('click', () => {
                    removeFromCart(product.title);
                });

                cartRows.appendChild(productElement);

                total += product.quantity * product.price;
            });
        }

        productCount.textContent = cart.reduce((acc, product) => acc + product.quantity, 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    function showCheckoutSummary() {
        let summary = 'Resumen de tu compra:\n\n';
        cart.forEach(product => {
            summary += `${product.quantity} x ${product.title} - $${(product.quantity * product.price).toFixed(2)}\n`;
        });
        summary += `\nTotal: ${document.querySelector('.total-pagar').textContent}`;
        alert(summary);
    }

    window.addToCart = addToCart;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
});