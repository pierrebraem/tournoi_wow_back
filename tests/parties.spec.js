const express = require('express');
const bodyParser = require('body-parser');
const partiesRouter = require('../routes/parties');
const db = require('../db');
const request = require('supertest');

const app = express();
app.use(bodyParser.json());
app.use('/parties', partiesRouter);

jest.mock('../db');

afterEach(() => {
    jest.clearAllMocks();
});

describe('parties', () => {
    describe('GET parties', () => {
        it('Get all parties', async () => {
            const mockParties = [
                {
                    id: 1,
                    party_name: "Groupe 1"
                },
                {
                    id: 2,
                    party_name: "Groupe 2"
                }
            ];

            db.query.mockResolvedValue({ rows: mockParties });

            const response = await request(app).get('/parties');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockParties));
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM parties');
        });

        it('Get character details with id', async () => {
            const id = "2";
            const mockParty = [
                {
                    id: 2,
                    party_name: "Groupe 2",
                },
            ];
        
            db.query.mockResolvedValue({ rows: mockParty });
        
            const response = await request(app).get('/parties/' + id);
            expect(response.status).toBe(200);
        
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockParty));
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM parties WHERE id = $1', [id]);
        });
    });

    describe('POST parties', () => {
        it('Add a party', async () => {
            const newParty = {
                name: "Groupe 3",
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    }
                ]
            }
            const mockResponse = { id: 3, ...newParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .post('/parties')
            .send(newParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body).toEqual({"message": "Created"});
            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO parties (party_name) VALUES ($1) RETURNING id', 
                [newParty.name]
            );
            expect(db.query).toHaveBeenCalledWith(
                'INSERT INTO compose VALUES ($1, $2)', 
                [3, newParty.characters[0].id]
            );
        });

        it('Try add a party without "name" attribue', async () => {
            const newParty = {
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    }
                ]
            }
            const mockResponse = { id: 3, ...newParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .post('/parties')
            .send(newParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'name' is required"});
        });

        it('Try add a party without "characters" attribue', async () => {
            const newParty = {
                name: 'Groupe 3'
            }
            const mockResponse = { id: 3, ...newParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .post('/parties')
            .send(newParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'characters' is required"});
        });

        it('Try add a party with more than 5 characters', async () => {
            const newParty = {
                name: 'Groupe 3',
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    },
                    {
                        id: 3,
                        name: "Mighty Avenger",
                        role: "Spécialiste des dégâts",
                        class: "Druide"
                    },
                    {
                        id: 4,
                        name: "Mighty Avenger",
                        role: "Spécialiste des dégâts",
                        class: "Druide"
                    },
                    {
                        id: 5,
                        name: "Mighty Avenger",
                        role: "Spécialiste des dégâts",
                        class: "Druide"
                    },
                    {
                        id: 6,
                        name: "Mighty Avenger",
                        role: "Spécialiste des dégâts",
                        class: "Druide"
                    },
                ]
            }
            const mockResponse = { id: 3, ...newParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .post('/parties')
            .send(newParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "Limit of characters (5) per party exceeded"});
        });

        it('Try add a party with more than 1 Tank', async () => {
            const newParty = {
                name: 'Groupe 3',
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    },
                    {
                        id: 3,
                        name: "Mighty Avenger",
                        role: "Tank",
                        class: "Druide"
                    }
                ]
            }
            const mockResponse = { id: 3, ...newParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .post('/parties')
            .send(newParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "Limit of Tanks (1) per party exceeded"});
        });

        it('Try add a party with more than 1 Healer', async () => {
            const newParty = {
                name: 'Groupe 3',
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    },
                    {
                        id: 3,
                        name: "Mighty Avenger",
                        role: "Soigneur",
                        class: "Druide"
                    }
                ]
            }
            const mockResponse = { id: 3, ...newParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .post('/parties')
            .send(newParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "Limit of Healers (1) per party exceeded"});
        });
    });

    describe('PUT parties', () => {
        it('Update a character', async () => {
            const id = "3";
            const updatedParty = {
                name: "Groupe 4",
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Mighty Raven",
                        role: "Dégâts",
                        class: "Soigneur"
                    }
                ]
            }
            const mockResponse = { id: 3, ...updatedParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .put('/parties/' + id)
            .send(updatedParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({"message": "Updated"});
            expect(db.query).toHaveBeenCalledWith(
                'UPDATE parties SET party_name = $2 WHERE id = $1',
                [id, updatedParty.name]
            );
            expect(db.query).toHaveBeenCalledWith(
                'SELECT * FROM compose WHERE parties_id = $1',
                [id]
            );
        });

        it('Try update a party without "name" attribue', async () => {
            const updatedParty = {
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    }
                ]
            }
            const mockResponse = { id: 3, ...updatedParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .put('/parties/' + 3)
            .send(updatedParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'name' is required"});
        });

        it('Try update a party without "characters" attribue', async () => {
            const updatedParty = {
                name: "Groupe 4"
            }
            const mockResponse = { id: 3, ...updatedParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .put('/parties/' + 3)
            .send(updatedParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'characters' is required"});
        });

        it('Try update a party with more than 5 characters', async () => {
            const updatedParty = {
                name: 'Groupe 4',
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    },
                    {
                        id: 3,
                        name: "Mighty Avenger",
                        role: "Spécialiste des dégâts",
                        class: "Druide"
                    },
                    {
                        id: 4,
                        name: "Mighty Avenger",
                        role: "Spécialiste des dégâts",
                        class: "Druide"
                    },
                    {
                        id: 5,
                        name: "Mighty Avenger",
                        role: "Spécialiste des dégâts",
                        class: "Druide"
                    },
                    {
                        id: 6,
                        name: "Mighty Avenger",
                        role: "Spécialiste des dégâts",
                        class: "Druide"
                    },
                ]
            }
            const mockResponse = { id: 3, ...updatedParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .put('/parties/' + 3)
            .send(updatedParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "Limit of characters (5) per party exceeded"});
        });

        it('Try update a party with more than 1 Tank', async () => {
            const updatedParty = {
                name: 'Groupe 4',
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    },
                    {
                        id: 3,
                        name: "Mighty Avenger",
                        role: "Tank",
                        class: "Druide"
                    }
                ]
            }
            const mockResponse = { id: 3, ...updatedParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .put('/parties/' + 3)
            .send(updatedParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "Limit of Tanks (1) per party exceeded"});
        });

        it('Try update a party with more than 1 Healer', async () => {
            const updatedParty = {
                name: 'Groupe 4',
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Assassin",
                        role: "Tank",
                        class: "Druide"
                    },
                    {
                        id: 2,
                        name: "Resolute Fury",
                        role: "Soigneur",
                        class: "Evocateur"
                    },
                    {
                        id: 3,
                        name: "Mighty Avenger",
                        role: "Soigneur",
                        class: "Druide"
                    }
                ]
            }
            const mockResponse = { id: 3, ...updatedParty };

            db.query.mockResolvedValue({ rows: [mockResponse] });

            const response = await request(app)
            .put('/parties/' + 3)
            .send(updatedParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "Limit of Healers (1) per party exceeded"});
        });
    });

    describe("DELETE parties", () => {
        it("Delete a party", async () => {
            const id = "1";
            db.query.mockResolvedValue({ rows: [{ id: id }]});

            const response = await request(app).delete('/parties/' + id);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ 'message': 'Deleted' });
            expect(db.query).toHaveBeenCalledWith(
                'DELETE FROM compose WHERE parties_id = $1',
                [id]
            )
            expect(db.query).toHaveBeenCalledWith(
                'DELETE FROM parties WHERE id = $1',
                [id]
            )
        })
    })
});