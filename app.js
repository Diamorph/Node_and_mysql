const {faker} = require('@faker-js/faker');
const mysql = require('mysql2/promise');

connectToDB();

async function connectToDB() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'join_us'
    });

    // await insertUser(connection);
    // await insertUsers(connection);
    await earliestDateUserJoined(connection);
    await emailAndEarliestDateUserJoined(connection);
    await groupByUserJoinMonth(connection);
    await countYahooEmails(connection);
    await countEmailHosts(connection);
    await countEmailHosts(connection);
    // await countUsers(connection);

    await connection.end();
}


async function countUsers(connection) {
    // // A simple SELECT query
    try {
        const [results, fields] = await connection.query(
            'SELECT count(*) as total from users'
        );

        console.log('Total User count: ', results[0].total); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }
}

async function earliestDateUserJoined(connection) {
    try {
        const [results, fields] = await connection.query(
            // 'SELECT created_at as date FROM users ORDER BY date LIMIT 1'
            `SELECT DATE_FORMAT(MIN(created_at), '%M %D %Y') AS date FROM users`
        );
        console.log('ealiest date user joined: ', results[0].date);
    } catch (err) {
        console.log(err);
    }
}

async function emailAndEarliestDateUserJoined(connection) {
    try {
        const [results, fields] = await connection.query(
            // 'SELECT email, created_at AS date FROM users ORDER BY date LIMIT 1'
            `
                SELECT email, DATE_FORMAT(created_at, \'%M %D %Y\') AS date FROM users
                WHERE created_at = (SELECT MIN(created_at) FROM users)
            `
        );
        console.log('ealiest date user joined: ', results[0].date);
        console.log('Email: ', results[0].email);
    } catch (err) {
        console.log(err);
    }
}

async function groupByUserJoinMonth(connection) {
    try {
        const [results, fields] = await connection.query(
            'SELECT MONTHNAME(created_at) AS month, COUNT(*) AS count FROM users GROUP BY month ORDER BY count DESC'
        );

        console.log(results);
    } catch (err) {
        console.log(err);
    }
}

async function countYahooEmails(connection) {
    try {
        const [results, fields] = await connection.query(
            'SELECT COUNT(*) AS yahoo_users FROM users WHERE email LIKE \'%@yahoo.com\';'
        );

        console.log('Yahoo users: ', results[0].yahoo_users);
    } catch (err) {
        console.log(err);
    }
}

async function countEmailHosts(connection) {
    try {
        const [results, fields] = await connection.query(
           `SELECT 
                CASE 
                    WHEN email LIKE '%@gmail.com' THEN 'gmail'
                    WHEN email LIKE '%@yahoo.com' THEN 'yahoo'
                    WHEN email LIKE '%@hotmail.com' THEN 'hotmail'
                    ELSE 'other' 
                END AS provider,
                count(*) as total_users
            FROM users GROUP BY provider ORDER BY total_users DESC;`
        );
        console.log('Yahoo users: ', results);
    } catch (err) {
        console.log(err);
    }
}

async function insertUsers(connection) {
    try {
        const data = [];
        for (let i = 0; i < 500; i++) {
            data.push([ faker.internet.email(), faker.date.past()])
        }
        const query = 'INSERT INTO users (email, created_at) VALUES ?';
        const [results, fields] = await connection.query(query, [data]);

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }
}

async function insertUser(connection) {
    try {
        const person = {
            email: faker.internet.email(),
            created_at: faker.date.past()
        };
        console.log(person);
        const [results, fields] = await connection.query(
            // `INSERT INTO users(email) VALUES ('wyatt_the_dog@gmail.com')`
            `INSERT INTO users SET ?`, person
        );

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }
}
