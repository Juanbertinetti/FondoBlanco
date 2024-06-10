document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const products = data.products;
                const catalogContainer = document.getElementById('catalog');
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';

                    productCard.innerHTML = `
                        <img src="${product.imagen_url}" alt="${product.nombre}">
                        <h2>${product.nombre}</h2>
                        <p>Precio: $${product.precio}</p>
                        <p>Categoría: ${product.categoria}</p>
                        <p>Descripción: ${product.descripcion}</p>
                        <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
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
        name: productElement.querySelector('h2').textContent,
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