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
                                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Agregar al carrito</button>
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
                                quantity: 1,
                                title: productCard.querySelector('.card-title').textContent,
                                price: productCard.querySelector('.card-text').textContent.split(' ')[1],
                            };
                            addToCart(infoProduct);
                        });
                    });
                } else {
                    console.error('Error al obtener los productos:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    }
});
