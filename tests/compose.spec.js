const express = require('express');
const bodyParser = require('body-parser');
const composeRouter = require('../routes/compose');
const db = require('../db');
const request = require('supertest');

const app = express();
app.use(bodyParser.json());
app.use('/compose', composeRouter);

jest.mock('../db');

afterEach(() => {
    jest.clearAllMocks();
});

describe('compose', () => {
    describe('GET composes', () => {
        it('Get all characters of a party', async () => {
            const id = "1";
            const mockComposes = [
                {
                    id: 1,
                    name: "Radiant Crusader",
                    classe: "Druide",
                    role: "Tank"
                },
                {
                    id: 2,
                    name: "Mystic Blizzard",
                    classe: "Guerrier",
                    role: "Dégâts"
                }
            ];

            db.query.mockResolvedValue({ rows: mockComposes });

            const response = await request(app).get('/compose/' + id);
            expect(response.status).toBe(200);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockComposes));
            expect(db.query).toHaveBeenCalledWith(
                'SELECT characters.id, characters.name, class.label classe, roles.label role FROM compose INNER JOIN characters ON compose.characters_id = characters.id INNER JOIN class ON characters.class_id = class.id INNER JOIN roles ON characters.role_id = roles.id WHERE compose.parties_id = $1',
                [id]
            )
        });
    });
})