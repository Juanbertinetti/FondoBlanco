
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

function addToCart(infoProduct) {
    const exists = allProducts.some(product => product.title === infoProduct.title);

    if (exists) {
        const products = allProducts.map(product => {
            if (product.title === infoProduct.title) {
                product.quantity++;
                return product;
            } else {
                return product;
            }
        });
        allProducts = [...products];
    } else {
        allProducts = [...allProducts, infoProduct];
    }

    console.log("Carrito de compras:", allProducts);  // Debugging: Ver el estado del carrito
    showHTML();
}

rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter(product => product.title !== title);

        showHTML();
    }
});

const showHTML = () => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

        rowProduct.append(containerProduct);

        total += parseFloat(product.quantity) * parseFloat(product.price.slice(1));
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
};

// Lógica para el botón "Ir a pagar"
document.getElementById('checkout-button').addEventListener('click', () => {
    const summaryContainer = document.getElementById('checkout-summary');
    const totalContainer = document.getElementById('checkout-total');
    
    summaryContainer.innerHTML = '';
    
    let total = 0;
    allProducts.forEach(product => {
        const productSummary = document.createElement('div');
        productSummary.innerHTML = `
            <p>${product.quantity} x ${product.title} - ${product.price}</p>
        `;
        summaryContainer.append(productSummary);
        total += parseInt(product.quantity * product.price.slice(1));
    });
    
    totalContainer.innerText = `$${total}`;
    
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
});

// Lógica para el botón "Comprar" dentro del modal
document.getElementById('confirm-purchase').addEventListener('click', () => {
    const total = document.getElementById('checkout-total').innerText.slice(1);

    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart: allProducts, total })
    }).then(response => {
        if (response.ok) {
            alert('Correo enviado con éxito.');
        } else {
            response.text().then(text => alert('Hubo un problema al enviar el correo: ' + text));
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al enviar el correo: ' + error);
    });
});
