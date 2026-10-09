const express = require('express');
const bodyParser = require('body-parser');
const classRouter = require('../routes/class');
const db = require('../db');
const request = require('supertest');

const app = express();
app.use(bodyParser.json());
app.use('/class', classRouter);

jest.mock('../db');

afterEach(() => {
    jest.clearAllMocks();
});

describe('class', () => {
    describe('GET class', () => {
        it('Get all classes', async () => {
            const mockClasses = [
                {
                    id: 1,
                    label: "Guerrier"
                },
                {
                    id: 2,
                    label: "Paladin"
                },
                {
                    id: 3,
                    label: "Chasseur"
                }
            ];

            db.query.mockResolvedValue({ rows: mockClasses });

            const response = await request(app).get('/class');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockClasses));
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM class');
        });
    });
});