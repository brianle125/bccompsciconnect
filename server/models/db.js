const { Pool } = require('pg');
require('dotenv').config()

const pool = new Pool({
    // user:
    // host:
    // password:
})

const helpers = {
    //database queries
    init: async function() {
        const b = 'CREATE TABLE boards IF NOT EXISTS (id integer SERIAL, title character varying(255), created_at timestamp, PRIMARY KEY(id))'

    }
}

module.exports = { helpers }