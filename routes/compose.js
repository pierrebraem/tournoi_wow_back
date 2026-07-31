const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour afficher tous les personnages d'un groupe
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await db.query("SELECT characters.id, characters.name, class.id class_id, class.label class_label, roles.id role_id,roles.label role_label FROM compose INNER JOIN characters ON compose.characters_id = characters.id INNER JOIN class ON characters.class_id = class.id INNER JOIN roles ON characters.role_id = roles.id WHERE compose.parties_id = $1", [id]);
        const characters = result.rows
        const formated = []

        for (const character of characters){
            formated.push({
                id: character.id,
                name: character.name,
                class: {
                    id: character.class_id,
                    label: character.class_label,
                },
                role: {
                    id: character.role_id,
                    label: character.role_label,
                },
                ilvl: character.ilvl,
                rio: character.rio
            })
        }
        
        res.json(formated);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;