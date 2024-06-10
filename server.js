import express from 'express';
import mysql from 'mysql';
import userRouter from './routes/user.routes.js';
import carritosRouter from './routes/carritos.routes.js';
import productsRouter from './routes/products.routes.js';

const app = express();
const port = 3002;

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fondoblanco'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

// Middleware para agregar la conexión a las solicitudes
app.use((req, res, next) => {
    req.db = connection;
    next();
});

// Middleware para el manejo de datos JSON
app.use(express.json());

// Rutas
app.use('/user', userRouter);
app.use('/carrito', carritosRouter);
app.use('/api', productsRouter); // Agregar el router de productos

app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});