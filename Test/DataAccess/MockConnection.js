const mysql = require('mysql2');

const mockConnection = {
    query: jest.fn()
};

beforeAll(async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'Kanin',
        password: '123',
        database: 'agenda'
    });
    mockConnection.query = jest.fn(connection.query.bind(connection));
});

afterAll(async () => {
    mockConnection.query.mockRestore();
});

module.exports = mockConnection;