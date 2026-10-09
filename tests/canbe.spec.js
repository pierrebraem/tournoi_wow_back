const express = require('express');
const bodyParser = require('body-parser');
const canbeRouter = require('../routes/canbe');
const db = require('../db');
const request = require('supertest');

const app = express();
app.use(bodyParser.json());
app.use('/canbe', canbeRouter);

jest.mock('../db');

afterEach(() => {
    jest.clearAllMocks();
});

describe('canbe', () => {
    describe('canbe class', () => {
        it('Get all roles from a class', async () => {
            const mockRoles = [
                {
                    id: 1,
                    label: "Tank"
                },
                {
                    id: 2,
                    label: "Soigneur"
                }
            ];

            db.query.mockResolvedValue({ rows: mockRoles });

            const response = await request(app).get('/canbe/class/1');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockRoles));
            expect(db.query).toHaveBeenCalledWith('SELECT id FROM class WHERE id = $1', ["1"]);
            expect(db.query).toHaveBeenCalledWith('SELECT roles.id, roles.label FROM can_be INNER JOIN roles ON can_be.role_id = roles.id WHERE can_be.class_id = $1', ["1"]);
        });

        it('Get 404 if class does not exist', async () => {
            db.query.mockResolvedValue({ rows: [] });

            const response = await request(app).get('/canbe/class/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ "message": "Class not found" });
        });
    });
});