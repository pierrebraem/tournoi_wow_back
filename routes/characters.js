const express = require('express');
const router = express.Router();
const checkCharactersInput = require("../middlewares/checkCharactersInput");
const db = require('../db');

// Route pour afficher toutes les personnages
router.get('/', async (req, res) => {
    try{
        const result = await db.query("SELECT characters.id, class.label class, roles.label role, characters.ilvl, characters.rio FROM characters INNER JOIN class ON characters.class_id = class.id INNER JOIN roles ON characters.role_id = roles.id");
        console.log("coucou");
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour afficher les détails d'un personnage
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await db.query("SELECT characters.id, characters.name, class.id class_id, class.label class_label, roles.id role_id, roles.label role_label, characters.ilvl, characters.rio FROM characters INNER JOIN class ON characters.class_id = class.id INNER JOIN roles ON characters.role_id = roles.id WHERE characters.id = $1", [id]);
        const character = result.rows[0];

        res.json({
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
            rio: character.rio,
        });

    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour ajouter un personnage
router.post('/', checkCharactersInput, async (req, res) => {
    const body = req.body;

    try{
        await db.query('INSERT INTO characters (name, class_id, role_id, ilvl, rio) VALUES ($1, $2, $3, $4, $5)', [body.name, body.class_id, body.role_id, body.ilvl, body.rio]);
        res.status(201).send({ "message": "Created" });
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour mettre à jour un personnage
router.put("/:id", checkCharactersInput, async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try{
        await db.query("UPDATE characters SET name = $2, class_id = $3, role_id = $4, ilvl = $5, rio = $6 WHERE id = $1", [id, body.name, body.class_id, body.role_id, body.ilvl, body.rio]);
        res.status(200).send({ "message": "Updated" });

    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try{
        await db.query("DELETE FROM compose WHERE characters_id = $1", [id]);
        await db.query("DELETE FROM characters WHERE id = $1", [id]);
        res.status(200).send({ "message": "Deleted" });
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;