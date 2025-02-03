import passport from "passport";
import { Router } from "express";
import jwt from "jsonwebtoken";

const loginRouter = Router();

loginRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  })
);

loginRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generar el JWT
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, photo: req.user.photo }, 
      process.env.JWT_SECRET, 
      { expiresIn: '3h' }
    );

    // Enviar el token al cliente
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

export { loginRouter };