const express = require('express');
const bodyParser = require('body-parser');
const charactersRouter = require('../routes/characters');
const db = require('../db');
const request = require("supertest");

const app = express();
app.use(bodyParser.json());
app.use('/characters', charactersRouter);

jest.mock('../db');

afterEach(() => {
    jest.clearAllMocks();
});

describe('characters', () => {
    describe('GET characters', () => {
        it('Get all characters', async () => {
            const mockUsers = [
                {
                    id: 1,
                    name: "Stealthy Frost",
                    class: { id: 2, label: "Paladin" },
                    role: { id: 1, label: "Tank"},
                    ilbl: 456,
                    rio: 3
                },
                {
                    id: 2,
                    name: "Savage Bolt",
                    class: { id: 1, label: "Guerrier" },
                    role: { id: 3, label: "Spécialiste des dégâts" },
                    ilbl: 254,
                    rio: 145
                },
                {
                    id: 3,
                    name: "Swift Dagger",
                    class: { id: 7, label: "Mage" },
                    role: { id: 4, label: "Dégâts" },
                    ilbl: 600,
                    rio: 3000
                },
            ];

            db.query.mockResolvedValue({ rows: mockUsers });

            const response = await request(app).get('/characters');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockUsers));
            expect(db.query).toHaveBeenCalledWith('SELECT characters.id, characters.name, class.label class, roles.label role, characters.ilvl, characters.rio FROM characters INNER JOIN class ON characters.class_id = class.id INNER JOIN roles ON characters.role_id = roles.id');
        });

        it('Get character details with id', async () => {
            const id = "2";

            const mockUsers = [
                {
                    id: 2,
                    name: "Savage Bolt",
                    class_id: 1,
                    class_label: "Guerrier",
                    role_id: 3,
                    role_label: "Spécialiste des dégâts",
                    ilvl: 254,
                    rio: 145,
                }
            ];

            const expectedUser = 
                {
                    id: 2,
                    name: "Savage Bolt",
                    class: { id: 1, label: "Guerrier" },
                    role:{ id: 3, label: "Spécialiste des dégâts" },
                    ilvl: 254,
                    rio: 145,
                };

            db.query.mockResolvedValue({ rows: mockUsers });

            const response = await request(app).get('/characters/' + id);
            expect(response.status).toBe(200);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedUser));
            expect(db.query).toHaveBeenCalledWith('SELECT characters.id, characters.name, class.id class_id, class.label class_label, roles.id role_id, roles.label role_label, characters.ilvl, characters.rio FROM characters INNER JOIN class ON characters.class_id = class.id INNER JOIN roles ON characters.role_id = roles.id WHERE characters.id = $1', [id]);
        });

        it('Get 404 if character does not exist', async () => {
            const id = "2";

            db.query.mockResolvedValue({ rows: [] });
            
            const response = await request(app).get('/characters/' + id);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ "message" : "Character not found" });
        });
    });

    describe('POST characters', () => {
        it('Add a character', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                class_id: 2,
                role_id: 1,
                ilvl: 300,
                rio: 50
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body).toEqual({"message": "Created"});
            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO characters (name, class_id, role_id, ilvl, rio) VALUES ($1, $2, $3, $4, $5)", 
                [newCharacter.name, newCharacter.class_id, newCharacter.role_id, newCharacter.ilvl, newCharacter.rio]
            );
        });

        it('Try add a character without "name" attribue', async () => {
            const newCharacter = {
                class_id: 2,
                role_id: 1,
                ilvl: 300,
                rio: 50
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'name' is required"});
        });

        it('Try add a character without "class_id" attribue', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                role_id: 1,
                ilvl: 300,
                rio: 50
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'class_id' is required"});
        });

        it('Try add a character without "role_id" attribue', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                class_id: 2,
                ilvl: 300,
                rio: 50
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'role_id' is required"});
        });

        it('Try add a character without "ilvl" attribue', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                class_id: 2,
                role_id: 1,
                rio: 50
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'ilvl' is required"});
        });

        it('Try add a character without "rio" attribue', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                class_id: 2,
                role_id: 1,
                ilvl: 300
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'rio' is required"});
        });

        it('Try add a character with a manus valus in "ilvl" attribue', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                class_id: 2,
                role_id: 1,
                ilvl: -12,
                rio: 50
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'ilvl' must be between 0 and 645"});
        });

        it('Try add a character with a valus over 645 in "ilvl" attribue', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                class_id: 2,
                role_id: 1,
                ilvl: 650,
                rio: 50
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'ilvl' must be between 0 and 645"});
        });

        it('Try add a character with a manus valus in "rio" attribue', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                class_id: 2,
                role_id: 1,
                ilvl: 300,
                rio: -3
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'rio' must be between 0 and 4500"});
        });

        it('Try add a character with a valus over 4500 in "rio" attribue', async () => {
            const newCharacter = {
                name: "Valiant Oracle",
                class_id: 2,
                role_id: 1,
                ilvl: 300,
                rio: 5000
            };
            const mockResponse = { id: 1, ...newCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .post('/characters')
            .send(newCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'rio' must be between 0 and 4500"});
        });
    });

    describe("PUT characters", () => {
        it('Update a character', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                role_id: 2,
                ilvl: 555,
                rio: 123
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({"message": "Updated"});
            expect(db.query).toHaveBeenCalledWith(
                "UPDATE characters SET name = $2, class_id = $3, role_id = $4, ilvl = $5, rio = $6 WHERE id = $1", 
                [id, updatedCharacter.name, updatedCharacter.class_id, updatedCharacter.role_id, updatedCharacter.ilvl, updatedCharacter.rio]
            );
        });

        it('Get 404 if character does not exist', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                role_id: 2,
                ilvl: 555,
                rio: 123
            };

            db.query.mockResolvedValue({ rowCount: 0 });

            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({"message" : "Character not found"});
        });

        it('Try update a character without "name" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                class_id: 3,
                role_id: 2,
                ilvl: 555,
                rio: 123
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'name' is required"});
        });

        it('Try update a character without "class_id" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                role_id: 2,
                ilvl: 555,
                rio: 123
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'class_id' is required"});
        });

        it('Try update a character without "role_id" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                ilvl: 555,
                rio: 123
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'role_id' is required"});
        });

        it('Try update a character without "ilvl" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                role_id: 2,
                rio: 123
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'ilvl' is required"});
        });

        it('Try update a character without "rio" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                role_id: 2,
                ilvl: 555
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'rio' is required"});
        });

        it('Try update a character with a manus valus in "ilvl" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                role_id: 2,
                ilvl: -5,
                rio: 123
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'ilvl' must be between 0 and 645"});
        });

        it('Try update a character with a valus over 645 in "ilvl" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                role_id: 2,
                ilvl: 650,
                rio: 123
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'ilvl' must be between 0 and 645"});
        });

        it('Try update a character with a manus valus in "rio" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                role_id: 2,
                ilvl: 555,
                rio: -8
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'rio' must be between 0 and 4500"});
        });

        it('Try update a character with a valus over 4500 in "rio" attribue', async () => {
            const id = "3";
            const updatedCharacter = {
                name: "Radiant Viper",
                class_id: 3,
                role_id: 2,
                ilvl: 555,
                rio: 5000
            };
            const mockResponse = { id: 3, ...updatedCharacter };
    
            db.query.mockResolvedValue({ rows: [mockResponse] });
    
            const response = await request(app)
            .put('/characters/' + id)
            .send(updatedCharacter)
            .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({"message": "The field 'rio' must be between 0 and 4500"});
        });
    });

    describe("DELETE characters", () => {
        it("Delete a character", async () => {
            const id = "1";
            db.query.mockResolvedValue({ rows: [{ id: id }]});

            const response = (await request(app).delete('/characters/' + id));

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Deleted' });
            expect(db.query).toHaveBeenCalledWith(
                'DELETE FROM characters WHERE id = $1',
                [id]
            );
        });

        it('Get 404 if character does not exist', async () => {
            const id = "1";
            db.query.mockResolvedValue({ rows: [] });

            const response = await request(app).delete('/characters/' + id);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({"message": "Character not found"});
        });
    });
});