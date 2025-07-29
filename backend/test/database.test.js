const request = require('supertest');
const db = require('../data/queries'); 
const dbCrud = require('../data/updates'); 


describe('Database connection', () => {
  test('should return users', async () => {
    const res = await db.getAllUsers();
    expect(Array.isArray(res)).toBe(true);
  });
});

describe('CRUD operations', () => {
    test('should update user name', async () => {    
        const res = await dbCrud.updatePersonalPreferences(5, { name: 'Alice' });
        expect(res).toHaveProperty('name', 'Alice');
    });

    test('should update user surname', async () => {    
        const res = await dbCrud.updatePersonalPreferences(5, { surname: 'Jones' });
        expect(res).toHaveProperty('surname', 'Jones');
    });
});
