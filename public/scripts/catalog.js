document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const products = data.products;
                const catalogContainer = document.getElementById('catalog');
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'col-12 col-md-6 col-lg-3 mb-4'; // Ajusta la clase aquí

                    productCard.innerHTML = `
                        <div class="product-card card h-100">
                            <img src="${product.imagen_url}" alt="${product.nombre}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title">${product.nombre}</h5>
                                <p class="card-text">Precio: $${product.precio}</p>
                                <p class="card-text">${product.descripcion}</p>
                                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Agregar al carrito</button>
                            </div>
                        </div>
                    `;

                    catalogContainer.appendChild(productCard);
                });

                // Añadir manejadores de eventos para los botones de "Agregar al carrito"
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = event.target.getAttribute('data-id');
                        addToCart(productId);
                    });
                });
            } else {
                console.error('Error al obtener los productos:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products/vendidos')
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const products = data.products;
                const catalogContainer = document.getElementById('catalog-vendidos');
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'col-12 col-md-6 col-lg-3 mb-4'; // Ajusta la clase aquí

                    productCard.innerHTML = `
                        <div class="product-card card h-100">
                            <img src="${product.imagen_url}" alt="${product.nombre}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title">${product.nombre}</h5>
                                <p class="card-text">Precio: $${product.precio}</p>
                                <p class="card-text">${product.descripcion}</p>
                                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Agregar al carrito</button>
                            </div>
                        </div>
                    `;

                    catalogContainer.appendChild(productCard);
                });

                // Añadir manejadores de eventos para los botones de "Agregar al carrito"
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = event.target.getAttribute('data-id');
                        addToCart(productId);
                    });
                });
            } else {
                console.error('Error al obtener los productos:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
});

function addToCart(productId) {
    const token = localStorage.getItem('token'); // Supongamos que el token está almacenado en localStorage
    const productElement = document.querySelector(`button[data-id="${productId}"]`).parentElement;
    const product = {
        id: productId,
        name: productElement.querySelector('h5').textContent,
        price: parseFloat(productElement.querySelector('p:nth-child(3)').textContent.replace('Precio: $', '')),
        quantity: 1 // Cantidad fija a 1 por ahora, puedes ajustarla según sea necesario
    };

    fetch('/api/addToCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, product })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            alert('Producto agregado al carrito exitosamente');
        } else {
            alert('Error al agregar el producto al carrito: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}