const { Router } = require("express");
const Email = require("../models/Email");
const { sendMassEmail } = require("../controllers/emailMarketing");

const emailRouter = Router();

// Ruta para guardar un nuevo email
emailRouter.post("/guardar-email", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Correo electrónico inválido." });
  }

  try {
    const newEmail = new Email({ email }); // No enviamos descuento ni suscripcion, se usan los valores por defecto del schema
    await newEmail.save();
    return res.status(201).json({ message: "Email guardado con éxito", email: newEmail });
  } catch (error) {
    console.error("Error al guardar el email:", error);
    return res.status(500).json({ error: "Hubo un error al guardar el email" });
  }
});

// Obtener todos los emails
emailRouter.get("/emails", async (req, res) => {
  try {
    const emails = await Email.find();
    return res.json(emails);
  } catch (error) {
    console.error("Error al obtener los emails:", error);
    return res.status(500).json({ error: "Hubo un error al obtener los emails" });
  }
});

// Actualizar un email (email y suscripción)
emailRouter.put("/actualizar-email/:id", async (req, res) => {
  const { id } = req.params;
  const { email, suscripcion } = req.body;

  if (email && !email.includes("@")) {
    return res.status(400).json({ error: "Correo electrónico inválido." });
  }

  try {
    const updatedEmail = await Email.findByIdAndUpdate(id, { email, suscripcion }, { new: true });
    if (!updatedEmail) {
      return res.status(404).json({ error: "Email no encontrado." });
    }
    return res.status(200).json({ message: "Email actualizado con éxito", email: updatedEmail });
  } catch (error) {
    console.error("Error al actualizar el email:", error);
    return res.status(500).json({ error: "Hubo un error al actualizar el email" });
  }
});

// Ruta para actualizar solo la suscripción
emailRouter.put("/actualizar-suscripcion/:id", async (req, res) => {
  const { id } = req.params;
  const { suscripcion } = req.body;

  if (typeof suscripcion !== "boolean") {
    return res.status(400).json({ error: "Valor de suscripción inválido." });
  }

  try {
    const updatedEmail = await Email.findByIdAndUpdate(id, { suscripcion }, { new: true });
    if (!updatedEmail) {
      return res.status(404).json({ error: "Email no encontrado." });
    }
    return res.status(200).json({ message: "Suscripción actualizada con éxito", email: updatedEmail });
  } catch (error) {
    console.error("Error al actualizar la suscripción:", error);
    return res.status(500).json({ error: "Hubo un error al actualizar la suscripción" });
  }
});

// Eliminar un email
emailRouter.delete("/eliminar-email/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmail = await Email.findByIdAndDelete(id);
    if (!deletedEmail) {
      return res.status(404).json({ error: "Email no encontrado." });
    }
    return res.status(200).json({ message: "Email eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el email:", error);
    return res.status(500).json({ error: "Hubo un error al eliminar el email" });
  }
});

emailRouter.post("/send-mass-email", sendMassEmail);

module.exports = emailRouter;
