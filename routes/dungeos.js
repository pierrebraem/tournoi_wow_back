const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour afficher tous les donjons
router.get('/', async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM dungeon");
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;
