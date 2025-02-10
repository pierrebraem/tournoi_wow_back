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

        it('Get party details with id', async () => {
            const id = "2";
            const mockParty = [
                {
                    id: 2,
                    party_name: "Groupe 2"
                }
            ];

            db.query.mockResolvedValue({ rows: mockParty });

            const response = await request(app).get('/parties/' + id);
            expect(response.status).toBe(200);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockParty));
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM parties WHERE id = $1", [id]);
        });
    });

    describe('POST parties', () => {
        it('Add a party', async () => {
            const newParty = {
                name: "Groupe 3",
                characters: [
                    {
                        id: 1,
                        name: "Intrepid Hawk",
                        class_id: 2,
                        role_id: 1,
                        ilvl: 3000,
                        rio: 500,
                    },
                    {
                        id: 2,
                        name: "Swift Bow",
                        class_id: 4,
                        role_id: 3,
                        ilvl: 500,
                        rio: 250,
                    }
                ]
            }

            const mockResponse = { id: 1, ...newParty }

            db.query.mockResolvedValue({ rows: [mockResponse] });
            
            const response = await request(app)
            .post('/parties')
            .send(newParty)
            .set('Accept', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ "message": "Created" });
            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO parties (party_name) VALUES ($1) RETURNING id",
                [newParty.name]
            );
        });
    });

    describe('DELETE parties', () => {
        it('Delete a party', async () => {
            const id = "1";
            db.query.mockResolvedValue({ rows: [{ id: id }]});

            const response = await request(app).delete('/parties/' + id);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Deleted' });
            expect(db.query).toHaveBeenCalledWith(
                'DELETE FROM compose WHERE parties_id = $1',
                [id]
            )
        });
    });
});