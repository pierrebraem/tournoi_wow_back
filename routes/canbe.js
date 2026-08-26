const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour afficher l'id et le label des rôles en fonction de la classe
router.get('/class/:idClass', async (req, res) => {
    const idClass = req.params.idClass;

    try{
        const checkIfClassExists = await db.query("SELECT id FROM class WHERE id = $1", [idClass]);
        
        if(!checkIfClassExists.rows[0]){
            res.status(404).send({ "message" : "Class not found" });
            return;
        }

        const roles = await db.query("SELECT roles.id, roles.label FROM can_be INNER JOIN roles ON can_be.role_id = roles.id WHERE can_be.class_id = $1", [idClass]);
        res.json(roles.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;