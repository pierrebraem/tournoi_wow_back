const express = require('express');
const router = express.Router();
const checkPartiesInput = require("../middlewares/checkPartiesInput");
const db = require('../db');

// Route pour afficher toutes les équipes
router.get('/', async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM parties");
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour afficher les détails d'une équipe
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await db.query("SELECT * FROM parties WHERE id = $1", [id]);

        if(!result.rows[0]){
            res.status(404).send({ "message": "Party not found" });
            return;
        }

        const party = result.rows[0];
        
        res.json(party);
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour ajouter une équipe
router.post('/', checkPartiesInput, async (req, res) => {
    const body = req.body;

    try{
        const result = await db.query('INSERT INTO parties (name) VALUES ($1) RETURNING id', [body.name]);
        
        const id = result.rows[0].id;

        for(const character of body.characters){        
            await db.query('INSERT INTO compose VALUES ($1, $2)', [id, character.id]);
        }

        res.status(201).send({ "message": "Created" });
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour mettre à jour une équipe
router.put('/:id', checkPartiesInput, async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try{
        const checkIfPartyExists = await db.query('SELECT id FROM parties WHERE id = $1', [id]);

        if(!checkIfPartyExists.rows[0]){
            res.status(404).send({ "message": "Party not found" });
            return;
        }

        await db.query('UPDATE parties SET name = $2 WHERE id = $1', [id, body.name]);
        
        const result = await db.query('SELECT * FROM compose WHERE parties_id = $1', [id]);

        const data = result.rows;
        const charactersDeleted = data.filter((compose) => !body.characters.some((character) => character.id == compose.characters_id));
        const charactersAdded = body.characters.filter((character) => !data.some((compose) => compose.characters_id == character.id));
        
        for(const deleted of charactersDeleted){
            await db.query('DELETE FROM compose WHERE parties_id = $1 AND characters_id = $2', [id, deleted.characters_id]);
        }

        for(const added of charactersAdded){
            await db.query('INSERT INTO compose VALUES ($1, $2)', [id, added.id]);
        }

        res.status(200).send({ "message": "Updated" });
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour supprimer une équipe
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try{
        const checkIfPartyExists = await db.query('SELECT id FROM parties WHERE id = $1', [id]);

        if(!checkIfPartyExists.rows[0]){
            res.status(404).send({ "message": "Party not found" });
            return;
        }
        
        await db.query("DELETE FROM compose WHERE parties_id = $1", [id]);
        await db.query("DELETE FROM parties WHERE id = $1", [id]);
        res.status(200).send({ "message": "Deleted" });
    }
    catch(err){
        console.error(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;