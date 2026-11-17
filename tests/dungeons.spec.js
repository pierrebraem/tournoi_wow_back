const express = require('express');
const bodyParser = require('body-parser');
const dungeonsRouter = require('../routes/dungeons');
const db = require('../db');
const request = require('supertest');

const app = express();
app.use(bodyParser.json());
app.use('/dungeons', dungeonsRouter);

jest.mock('../db');

afterEach(() => {
    jest.clearAllMocks();
});

describe('dungeons', () => {
    describe('GET dungeons', () => {
        it('Get all dungeons', async () => {
            const mockDungeons = [
                {
                    id: 1,
                    name: "Pierre's dungeons",
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

            db.query.mockResolvedValue({ rows: mockDungeons });

            const response = await request(app).get('/dungeons');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockDungeons));
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM dungeon');
        });
    });
});