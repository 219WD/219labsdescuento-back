const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/User');

// Serialización del usuario
passport.serializeUser((user, done) => {
    done(null, user._id); // Serializa solo el ID del usuario
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Busca el usuario en la base de datos
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Definir y registrar la estrategia de Google
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/google/callback",
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                // Busca un usuario existente por Google ID
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // Si no existe, crea un nuevo usuario
                    user = new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                    });
                    await user.save();
                }

                // Devuelve el usuario
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);
