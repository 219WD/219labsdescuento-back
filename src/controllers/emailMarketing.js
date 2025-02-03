const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars").default;
const path = require("path");
require("dotenv").config();

// Configurar el transporte de Nodemailer con Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Asegúrate de usar una "app password" si es Gmail
    },
});

// Configurar el motor de plantillas Handlebars
transporter.use(
    "compile",
    hbs({
        viewEngine: {
            extname: ".hbs",
            layoutsDir: path.join(__dirname, "../views"),
            defaultLayout: false,
        },
        viewPath: path.join(__dirname, "../views"),
        extName: ".hbs",
    })
);

// Función para enviar correos masivos con plantillas
const sendMassEmail = async (req, res) => {
    const { recipients, subject, template, variables } = req.body;

    if (!recipients || recipients.length === 0) {
        return res.status(400).json({ success: false, message: "Lista de destinatarios vacía" });
    }

    try {
        // Enviar los correos a todos los destinatarios
        await Promise.all(
            recipients.map((email) =>
                transporter.sendMail({
                    from: `"219Labs Agencia Digital" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject,
                    template, // Nombre del archivo Handlebars sin ".hbs"
                    context: variables, // Variables para la plantilla
                })
            )
        );

        res.status(200).json({ success: true, message: "Correos enviados con éxito" });
    } catch (error) {
        console.error("Error enviando los correos:", error);
        res.status(500).json({ success: false, message: "Error enviando los correos" });
    }
};

module.exports = { sendMassEmail };
