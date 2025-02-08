const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour afficher l'id et le label des rôles en fonction de la classe
router.get('/class/:idClass', async (req, res) => {
    const idClass = req.params.idClass;

    try{
        const roles = await db.query("SELECT roles.id, roles.label FROM can_be INNER JOIN roles ON can_be.role_id = roles.id WHERE can_be.class_id = $1", [idClass]);
        res.json(roles.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;