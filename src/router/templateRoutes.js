const { Router } = require("express");
const {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate
} = require("../controllers/templateController");

const templateRouter = Router();

templateRouter.post("/crear", createTemplate);
templateRouter.get("/verTemplates", getTemplates);
templateRouter.get("/verTemplate:id", getTemplateById);
templateRouter.put("/editar/:id", updateTemplate);
templateRouter.delete("/eliminar/:id", deleteTemplate);

module.exports = templateRouter;