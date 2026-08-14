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

            const mockDbRows = [
                {
                    id: 1,
                    name: "Radiant Crusader",
                    class_id: 2,
                    class_label: "Druide",
                    role_id: 1,
                    role_label: "Tank",
                    ilvl: null,
                    rio: null,
                },
                {
                    id: 2,
                    name: "Mystic Blizzard",
                    class_id: 1,
                    class_label: "Guerrier",
                    role_id: 4,
                    role_label: "Dégâts",
                    ilvl: null,
                    rio: null,
                }
            ];

            const expectedComposes = [
                {
                    id: 1,
                    name: "Radiant Crusader",
                    class: { id: 2, label: "Druide" },
                    role: { id: 1, label: "Tank" },
                    ilvl: null,
                    rio: null,
                },
                {
                    id: 2,
                    name: "Mystic Blizzard",
                    class: { id: 1, label: "Guerrier" },
                    role: { id: 4, label: "Dégâts" },
                    ilvl: null,
                    rio: null,
                }
            ];

            db.query.mockResolvedValue({ rows: mockDbRows });

            const response = await request(app).get('/compose/' + id);
            expect(response.status).toBe(200);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedComposes));
            expect(db.query).toHaveBeenCalledWith(
                'SELECT characters.id, characters.name, class.id class_id, class.label class_label, roles.id role_id, roles.label role_label FROM compose INNER JOIN characters ON compose.characters_id = characters.id INNER JOIN class ON characters.class_id = class.id INNER JOIN roles ON characters.role_id = roles.id WHERE compose.parties_id = $1',
                [id]
            );
        });
    });
});