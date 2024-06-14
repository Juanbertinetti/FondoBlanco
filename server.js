import express from 'express';
import mysql from 'mysql';
import userRouter from './routes/user.routes.js';
import carritosRouter from './routes/carritos.routes.js';
import productsRouter from './routes/products.routes.js';
import nodemailer from 'nodemailer';
import session from 'express-session';

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

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tu-email@gmail.com',
        pass: 'tu-contraseña'
    }
});

// Configuración de las sesiones
app.use(session({
    secret: 'tu-secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Usa true si estás usando HTTPS
}));

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


// Ruta para enviar correo electrónico con el resumen de la compra
app.post('/send-email', (req, res) => {
    if (!req.session.email) {
        return res.status(401).send('Usuario no autenticado');
    }

    const email = req.session.email;
    const { cart, total } = req.body;

    let cartItems = '';
    cart.forEach(item => {
        cartItems += `${item.quantity} x ${item.title} - ${item.price}\n`;
    });

    const mailOptions = {
        from: 'tu-email@gmail.com',
        to: email,
        subject: 'Resumen de tu compra',
        text: `Gracias por tu compra. Aquí tienes el resumen de tu pedido:\n\n${cartItems}\n\nTotal: $${total}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Correo enviado: ' + info.response);
    });
});

app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});