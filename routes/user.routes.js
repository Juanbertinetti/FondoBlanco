import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = "_AQPsssHV56kFO7ImQL9DPEj5UzCYuLGB8bSAmedv74gLPueV9abm51Ca18rIGJC";

router.post('/login', (req, res) => {
  const { username, pass } = req.body;

  req.db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario:', err);
      return res.status(500).json({ status: false, message: 'Error de servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: false, message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Comprobar la contraseña
    const controlPass = bcrypt.compareSync(pass, user.pass);
    if (!controlPass) {
      return res.status(401).json({ status: false, message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: 86400 });

    res.status(200).json({ status: true, token });
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
