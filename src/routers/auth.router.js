import express from 'express';
import userModel from './dao/models/user.model.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login'); // Renderiza la vista de login
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar las credenciales (consulta a la base de datos)
  const user = await userModel.findOne({ email, password }).exec();

  if (user) {
    req.session.user = {
      email: user.email,
      role: user.role // Se asume que el usuario tiene un campo `role` en el modelo
    };
    res.redirect('/products'); // Redirige a la vista de productos
  } else {
    res.redirect('/auth/login'); // Redirige de nuevo al login si las credenciales son inválidas
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(); // Destruye la sesión
  res.redirect('/auth/login'); // Redirige al login
});

export default router;
