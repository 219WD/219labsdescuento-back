const Template = require("../models/Template");

// Crear una nueva plantilla
exports.createTemplate = async (req, res) => {
    const { name, subject, content } = req.body;
    try {
        const newTemplate = new Template({ name, subject, content });
        await newTemplate.save();
        res.status(201).json({ success: true, message: "Plantilla creada con éxito", template: newTemplate });
    } catch (error) {
        console.error("Error al crear plantilla:", error);
        res.status(500).json({ success: false, message: "Error al crear plantilla" });
    }
};

// Obtener todas las plantillas
exports.getTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates);
    } catch (error) {
        console.error("Error al obtener plantillas:", error);
        res.status(500).json({ success: false, message: "Error al obtener plantillas" });
    }
};

// Obtener una plantilla por ID
exports.getTemplateById = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: "Plantilla no encontrada" });
        res.json(template);
    } catch (error) {
        console.error("Error al obtener plantilla:", error);
        res.status(500).json({ success: false, message: "Error al obtener plantilla" });
    }
};

// Actualizar una plantilla
exports.updateTemplate = async (req, res) => {
    const { name, subject, content } = req.body;
    try {
        const updatedTemplate = await Template.findByIdAndUpdate(req.params.id, { name, subject, content }, { new: true });
        if (!updatedTemplate) return res.status(404).json({ success: false, message: "Plantilla no encontrada" });
        res.json({ success: true, message: "Plantilla actualizada", template: updatedTemplate });
    } catch (error) {
        console.error("Error al actualizar plantilla:", error);
        res.status(500).json({ success: false, message: "Error al actualizar plantilla" });
    }
};

// Eliminar una plantilla
exports.deleteTemplate = async (req, res) => {
    try {
        const deletedTemplate = await Template.findByIdAndDelete(req.params.id);
        if (!deletedTemplate) return res.status(404).json({ success: false, message: "Plantilla no encontrada" });
        res.json({ success: true, message: "Plantilla eliminada" });
    } catch (error) {
        console.error("Error al eliminar plantilla:", error);
        res.status(500).json({ success: false, message: "Error al eliminar plantilla" });
    }
};
