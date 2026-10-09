const express = require('express');
const bodyParser = require('body-parser');
const dungeosRouter = require('../routes/dungeos');
const db = require('../db');
const request = require('supertest');

const app = express();
app.use(bodyParser.json());
app.use('/dungeos', dungeosRouter);

jest.mock('../db');

afterEach(() => {
    jest.clearAllMocks();
});

describe('dungeos', () => {
    describe('GET dungeos', () => {
        it('Get all dungeos', async () => {
            const mockDungeos = [
                {
                    id: 1,
                    name: "Pierre's dungeos",
                    level: 10,
                    timer: '30:00'
                },
                {
                    id: 2,
                    name: "Coucou",
                    level: 15,
                    timer: '45:00'
                },
                {
                    id: 3,
                    name: "Salut",
                    level: 5,
                    timer: '20:00'
                }
            ];

            db.query.mockResolvedValue({ rows: mockDungeos });

            const response = await request(app).get('/dungeos');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockDungeos));
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM dungeon');
        });
    });
});