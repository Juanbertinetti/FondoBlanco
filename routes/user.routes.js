import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = "_AQPsssHV56kFO7ImQL9DPEj5UzCYuLGB8bSAmedv74gLPueV9abm51Ca18rIGJC";

// Supongamos que tienes una tabla de usuarios en tu base de datos
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar que se proporcionen tanto el nombre de usuario como la contraseña
    if (!username || !password) {
      return res.status(400).json({ status: false, message: "Nombre de usuario y contraseña son requeridos" });
    }

    // Buscar el usuario en la base de datos
    const connection = req.db;
    const [user] = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    // Verificar si se encontró el usuario
    if (!user) {
      return res.status(401).json({ status: false, message: "Usuario no encontrado" });
    }

    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.pass);

    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Contraseña incorrecta" });
    }

    // Crear el token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });

    // Devolver el token al cliente
    res.status(200).json({ status: true, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ status: false, message: "Error de servidor" });
  }
});

router.post('/create', (req, res) => {
  const { name, lastname, username, email, password } = req.body;

  // Verifica que las contraseñas coincidan
  if (password !== req.body.password2) {
    return res.status(400).json({ status: false, message: 'Las contraseñas no coinciden' });
  }

  try {
    // Hashea la contraseña
    const hashedPass = bcrypt.hashSync(password, 8);

    // Crea un nuevo usuario
    const newUser = { name, lastname, username, email, pass: hashedPass };

    // Inserta el usuario en la base de datos
    req.db.query('INSERT INTO users SET ?', newUser, (err, results) => {
      if (err) {
        console.error('Error al crear el usuario:', err);
        return res.status(500).json({ status: false, message: 'Error de servidor' });
      }

      res.status(200).json({ status: true, message: 'Usuario registrado exitosamente' });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: 'Error al crear el usuario' });
  }
});

export default router;
