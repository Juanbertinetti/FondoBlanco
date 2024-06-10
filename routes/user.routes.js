import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = "_AQPsssHV56kFO7ImQL9DPEj5UzCYuLGB8bSAmedv74gLPueV9abm51Ca18rIGJC";

// Supongamos que tienes una tabla de usuarios en tu base de datos
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const connection = req.db;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
          console.error('Error al consultar la base de datos:', err);
          return res.status(500).json({ status: false, message: "Error de servidor" });
      }

      if (results.length === 0) {
          return res.status(401).json({ status: false, message: "Usuario no encontrado" });
      }

      const user = results[0];

      // Verificar la contraseña
      bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
              console.error('Error al comparar las contraseñas:', err);
              return res.status(500).json({ status: false, message: "Error de servidor" });
          }

          if (!isMatch) {
              return res.status(401).json({ status: false, message: "Contraseña incorrecta" });
          }

          // Crear el token
          const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });

          // Devolver el token al cliente
          res.status(200).json({ status: true, token });
      });
  });
});

router.post('/create', (req, res) => {
  const { name, lastname, username, pass } = req.body;

  try {
    const hashedPass = bcrypt.hashSync(pass, 8);

    const newUser = { name, lastname, username, pass: hashedPass };

    req.db.query('INSERT INTO users SET ?', newUser, (err, results) => {
      if (err) {
        console.error('Error al crear el usuario:', err);
        return res.status(500).json({ status: false, message: 'Error de servidor' });
      }

      res.status(200).json({ status: true });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: 'Error al crear el usuario' });
  }
});

export default router;
