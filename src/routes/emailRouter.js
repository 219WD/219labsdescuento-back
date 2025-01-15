const { Router } = require("express");
const Email = require("../models/Email");

const emailRouter = Router();

// Ruta para guardar los emails
emailRouter.post("/descuento/guardar-email", async (req, res) => {
  const { email } = req.body;

  // Verificar que el email sea válido
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Correo electrónico inválido." });
  }

  try {
    // Crear un nuevo documento con el email
    const newEmail = new Email({ email });
    await newEmail.save();
    return res.status(201).json({ message: "Email guardado con éxito" });
  } catch (error) {
    console.error("Error al guardar el email:", error);
    return res.status(500).json({ error: "Hubo un error al guardar el email" });
  }
});

// Ruta para obtener todos los emails
emailRouter.get("/descuento/emails", async (req, res) => {
  try {
    const emails = await Email.find();
    return res.json(emails);
  } catch (error) {
    console.error("Error al obtener los emails:", error);
    return res.status(500).json({ error: "Hubo un error al obtener los emails" });
  }
});

// Ruta para actualizar un email
emailRouter.put("/descuento/actualizar-email/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  // Verificar que el email sea válido
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Correo electrónico inválido." });
  }

  try {
    const updatedEmail = await Email.findByIdAndUpdate(id, { email }, { new: true });
    if (!updatedEmail) {
      return res.status(404).json({ error: "Email no encontrado." });
    }
    return res.status(200).json({ message: "Email actualizado con éxito", email: updatedEmail });
  } catch (error) {
    console.error("Error al actualizar el email:", error);
    return res.status(500).json({ error: "Hubo un error al actualizar el email" });
  }
});

// Ruta para eliminar un email
emailRouter.delete("/descuento/eliminar-email/:id", async (req, res) => {
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

module.exports = emailRouter;
