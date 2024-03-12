const { Pool } = require('pg');
require('dotenv').config()

const pool = new Pool({
    database: 'testing',
    user: 'postgres',
    host: 'localhost',
    password: process.env.LOCAL_PASS
})

const helpers = {
    //database queries
    init: async function() {
        //create tables
        const board = 'CREATE TABLE IF NOT EXISTS boards (id SERIAL, title character varying(255), PRIMARY KEY(id))'
        const topics = 'CREATE TABLE IF NOT EXISTS topics (id SERIAL, boardid integer, question varchar(1000), created_at timestamp, PRIMARY KEY(id), CONSTRAINT fk_board FOREIGN KEY (boardid) REFERENCES boards(id) ON DELETE CASCADE)'
        const users = 'CREATE TABLE IF NOT EXISTS users (id SERIAL, username varchar(255), role varchar(255), created_at timestamp, PRIMARY KEY(id))'
        const messages = 'CREATE TABLE IF NOT EXISTS messages (id SERIAL, topicid integer, body text, status varchar(255), created_at timestamp, PRIMARY KEY(id), CONSTRAINT fk_topic FOREIGN KEY(topicid) REFERENCES topics(id) ON DELETE CASCADE)'
        const login = 'CREATE TABLE IF NOT EXISTS login (id SERIAL, username varchar(255), password varchar(1000), PRIMARY KEY(id))'

        //call queries
        await pool.query(board);
        await pool.query(topics);
        await pool.query(users);
        await pool.query(messages);
        await pool.query(login);
    },


    getBoards: async function() {
        const res = await pool.query('SELECT * from boards ORDER by id');
        return res.rows;
    },

    getBoard: async function(id) {
        const res = await pool.query(`SELECT * FROM boards WHERE id = $1`, [id]);
        return res.rows[0];
    },

    getTopics: async function() {
        const res = await pool.query('SELECT * from topics ORDER BY id');
        return res.rows
    },

    getTopic: async function(id) {
        const q = 'SELECT * FROM topics WHERE id = $1'
        const res = await pool.query(q, [id]);
        return res.rows[0]
    },

    getMessages: async function(boardId, topicId) {
        const q = 'SELECT * FROM messages WHERE boardid = $1 AND topicid = $2';
        const res = await pool.query(q, [topicId]);
        return res.rows
    },
    


    addTopic: async function(boardid, question) {
        //check if board exists
        try {
            const precon = await pool.query(`SELECT * from boards WHERE id = ${boardid}`);
        } catch(err)
        {
            console.log('Board does not exist')
        }
        const q = 'INSERT INTO topics VALUES(DEFAULT, $1, $2)'
        const res = await pool.query(q, [boardid, question])
    }
    
}

module.exports = { helpers }