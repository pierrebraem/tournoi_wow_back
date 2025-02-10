const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour afficher tous les personnages d'un groupe
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await db.query("SELECT characters.id, characters.name, class.label classe, roles.label role FROM compose INNER JOIN characters ON compose.characters_id = characters.id INNER JOIN class ON characters.class_id = class.id INNER JOIN roles ON characters.role_id = roles.id WHERE compose.parties_id = $1", [id]);
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;