const checkPartiesInput = (req, res, next) => {
    const body = req.body;
    let hasTank = false;
    let hasHealer = false;

    if(body.name == undefined){
        res.status(400).send({ "message": "The field 'name' is required" });
        return;
    }

    if(body.characters == undefined){
        res.status(400).send({ "message": "The field 'characters' is required" });
        return;
    }

    if(body.characters.length > 5){
        res.status(400).send({ "message": "Limit of characters (5) per party exceeded" });
        return;
    }

    for(const character of body.characters){
        if(character.role == "Tank"){
            if(hasTank){
                res.status(400).send({ "message": "Limit of Tanks (1) per party exceeded" });
                return;
            }

            hasTank = true;
        }

        if(character.role == "Soigneur" || character.role == "Soins"){
            if(hasHealer){
                res.status(400).send({ "message": "Limit of Healers (1) per party exceeded" });
                return;
            }
            hasHealer = true;
        }
    }

    next();
}

module.exports = checkPartiesInput;