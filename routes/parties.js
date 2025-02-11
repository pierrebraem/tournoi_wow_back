const express = require('express');
const router = express.Router();
const checkPartiesInput = require("../middlewares/checkPartiesInput");
const db = require('../db');

// Route pour afficher toutes les groupes
router.get('/', async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM parties");
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour afficher les détails d'un groupe
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await db.query("SELECT * FROM parties WHERE id = $1", [id]);
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour ajouter un groupe
router.post('/', checkPartiesInput, async (req, res) => {
    const body = req.body;

    try{
        const result = await db.query('INSERT INTO parties (party_name) VALUES ($1) RETURNING id', [body.name])
        
        const id = result.rows[0].id;

        for(const character of body.characters){        
            await db.query('INSERT INTO compose VALUES ($1, $2)', [id, character.id]);
        }

        res.status(201).send({ "message": "Created" });
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour mettre à jour un groupe
router.put('/:id', checkPartiesInput, async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try{
        if(body.characters.length > 5){
            res.status(400).send({ "message": "Limit of characters (5) per party exceeded" });
            return;
        }

        await db.query('UPDATE parties SET party_name = $2 WHERE id = $1', [id, body.name]);
        
        let result = await db.query('SELECT * FROM compose WHERE parties_id = $1', [id]);

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
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour supprimer un groupe
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try{
        await db.query("DELETE FROM compose WHERE parties_id = $1", [id]);
        await db.query("DELETE FROM parties WHERE id = $1", [id]);
        res.status(200).send({ "message": "Deleted" });
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;