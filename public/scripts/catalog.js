document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const categoria_id = params.get('categoria_id');
    const apiEndpoint = categoria_id ? `/api/products?categoria_id=${categoria_id}` : '/api/products';
    loadProducts(apiEndpoint, 'catalog');

    function loadProducts(apiEndpoint, catalogId) {
        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    const products = data.products;
                    const catalogContainer = document.getElementById(catalogId);
                    catalogContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos
                    products.forEach(product => {
                        const productCard = document.createElement('div');
                        productCard.className = 'col-12 col-md-6 col-lg-3 mb-4';

                        productCard.innerHTML = `
                            <div class="product-card card h-100">
                                <img src="${product.imagen_url}" alt="${product.nombre}" class="card-img-top">
                                <div class="card-body">
                                    <h5 class="card-title">${product.nombre}</h5>
                                    <p class="card-text">Precio: $${product.precio}</p>
                                    <p class="card-text">${product.descripcion}</p>
                                    <button class="btn btn-primary add-to-cart" data-id="${product.id}" data-name="${product.nombre}" data-price="${product.precio}">Agregar al carrito</button>
                                </div>
                            </div>
                        `;

                        catalogContainer.appendChild(productCard);
                    });

                    // Añadir manejadores de eventos para los botones de "Agregar al carrito"
                    document.querySelectorAll('.add-to-cart').forEach(button => {
                        button.addEventListener('click', (event) => {
                            const productCard = event.target.closest('.product-card');
                            const infoProduct = {
                                id: event.target.getAttribute('data-id'),
                                name: event.target.getAttribute('data-name'),
                                price: parseFloat(event.target.getAttribute('data-price')),
                                quantity: 1
                            };
                            addProductToCart(infoProduct);
                        });
                    });
                } else {
                    console.error('Error al obtener los productos:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    }
});

// Función para inicializar el carrito
function initializeCart() {
    const cart = getCartFromLocalStorage();
    updateCartDisplay(cart);
}

// Obtener carrito desde Local Storage
function getCartFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Guardar carrito en Local Storage
function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Actualizar la visualización del carrito
function updateCartDisplay(cart) {
    const cartContainer = document.querySelector('.container-cart-products .row-product');
    const totalContainer = document.querySelector('.total-pagar');
    const cartCount = document.getElementById('contador-productos');
    let total = 0;

    cartContainer.innerHTML = '';
    cart.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        const productContent = `
            <span>${product.quantity}</span>
            <span>${product.name}</span>
            <span>$${(product.price * product.quantity).toFixed(2)}</span>
            <button class="btn btn-danger btn-sm remove-product" data-id="${product.id}">X</button>
        `;
        productElement.innerHTML = productContent;
        cartContainer.appendChild(productElement);

        total += product.price * product.quantity;
    });

    totalContainer.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        document.querySelector('.cart-empty').textContent = 'El carrito está vacío';
    } else {
        document.querySelector('.cart-empty').textContent = '';
    }

    // Event listeners para remover productos
    document.querySelectorAll('.remove-product').forEach(button => {
        button.addEventListener('click', event => {
            const productId = event.target.getAttribute('data-id');
            removeProductFromCart(productId);
        });
    });
}

// Función para agregar un producto al carrito
function addProductToCart(product) {
    const cart = getCartFromLocalStorage();
    const existingProduct = cart.find(p => p.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    saveCartToLocalStorage(cart);
    updateCartDisplay(cart);
}

// Función para remover un producto del carrito
function removeProductFromCart(productId) {
    let cart = getCartFromLocalStorage();
    cart = cart.filter(product => product.id !== productId);

    saveCartToLocalStorage(cart);
    updateCartDisplay(cart);
}

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', initializeCart);
