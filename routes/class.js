const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour afficher toutes les classes
router.get('/', async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM class");
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;