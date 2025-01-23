import passport from "passport";
import { Router } from "express";

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
          return res.status(401).json({ error: "Authentication failed" });
      }
      res.json({ user: req.user });
  }
);

export { loginRouter };