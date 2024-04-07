const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost" || process.env.DB_HOST,
  database: "testing",
  password: process.env.LOCAL_PASS,
});

const helpers = {
  //database queries
  init: async function () {
    //create tables
    const board = `CREATE TABLE IF NOT EXISTS boards (
      id SERIAL, 
      title character varying(255), 
      description varchar(255), 
      ordering integer, 
      PRIMARY KEY(id)
    )`;
    const topics = `CREATE TABLE IF NOT EXISTS topics (
      id SERIAL, 
      boardid integer, 
      question varchar(1000),
      created_by integer, 
      created_at timestamp, 
      last_modified timestamp, 
      latest_post timestamp, 
      PRIMARY KEY(id), 
      CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES users(id), 
      CONSTRAINT fk_board FOREIGN KEY (boardid) REFERENCES boards(id) 
      ON DELETE CASCADE
    )`;
    const users = `CREATE TABLE IF NOT EXISTS users (
      id SERIAL, 
      username varchar(255), 
      email varchar(255), 
      password varchar(1000),
      description varchar(500),
      role varchar(255), 
      created_at timestamp,
      profile_image bytea, 
      google_id varchar(1000),
      image_type varchar(1000),
      PRIMARY KEY(id)
    )`;
    const posts = `CREATE TABLE IF NOT EXISTS posts (
      id SERIAL, 
      created_by integer,
      topicid integer, 
      body text, 
      status varchar(255), 
      created_at timestamp, 
      last_modified timestamp, 
      PRIMARY KEY(id), 
      CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES users(id),
      CONSTRAINT fk_topic FOREIGN KEY(topicid) REFERENCES topics(id) 
      ON DELETE CASCADE
    )`;
    const login = `CREATE TABLE IF NOT EXISTS login (
      id SERIAL, 
      username varchar(255), 
      password varchar(1000), 
      PRIMARY KEY(id)
    )`;
    const userProfiles = `CREATE TABLE IF NOT EXISTS userprofiles (
      username varchar(255),
      filename varchar(400), 
      image bytea
    )`;

    const images = `CREATE TABLE IF NOT EXISTS images (
      username varchar(400),
      id SERIAL,
      filename varchar(400), 
      image bytea,
      url varchar(400),
      postid integer,
      userid integer,
      content_type varchar(400),
      PRIMARY KEY(id), 
      CONSTRAINT fk_user_id FOREIGN KEY (userid) REFERENCES users(id),
      CONSTRAINT fk_post_id FOREIGN KEY(postid) REFERENCES posts(id) 
      ON DELETE CASCADE
    )`;

    // stuff that's ok to send to everyone
    const publicUserInfo = `CREATE OR REPLACE VIEW public_user_info 
      AS SELECT id, username, description, role, created_at, profile_image 
      FROM users;
    `;

    //call queries
    await pool.query(users);
    await pool.query(login);
    await pool.query(board);
    await pool.query(topics);
    await pool.query(posts);
    await pool.query(userProfiles);
    await pool.query(images);
    await pool.query(publicUserInfo);
  },

  /**
   * USERS
   */

  getUser: async function (email) {
    const q = "SELECT * FROM users WHERE email=$1";
    const res = await pool.query(q, [email]);
    return res.rows;
  },

  getUsers: async function () {
    const q = "SELECT * FROM users";
    const res = await pool.query(q);
    return res.rows;
  },

  getUserByUsername: async function (username) {
    const q = "SELECT * FROM users WHERE username=$1";
    const res = await pool.query(q, [username]);
    return res.rows;
  },

  addUser: async function (username, email, password, role, google_id) {
    const q = `INSERT INTO users VALUES(DEFAULT, $1, $2, $3, 'User has not changed bio', $4, CURRENT_TIMESTAMP, NULL, $5)`;
    const query = await pool.query(q, [
      username,
      email,
      password,
      role,
      google_id,
    ]);
  },

  editUserProfile: async function (
    username,
    email,
    password,
    description,
    oldUsername
  ) {
    const q = `UPDATE users SET username=$1, email=$2, password=$3, description=$4 WHERE username = '${oldUsername}'`;
    const query = await pool.query(q, [username, email, password, description]);
  },

  editUserById: async function (id, username, role) {
    const q = `UPDATE users SET username=$2, role=$3 WHERE id = $1 RETURNING *`;
    const queryResult = await pool.query(q, [id, username, role]);
    return queryResult.rows[0];
  },

  deleteUser: async function (id) {
    const q = "DELETE FROM users WHERE id = $1";
    const queryResult = await pool.query(q, [id]);
  },

  /**
   * BOARDS
   */

  //Get all boards
  getBoards: async function () {
    const res = await pool.query("SELECT * from boards ORDER by id");
    return res.rows;
  },

  //Get specific board
  getBoard: async function (id) {
    const res = await pool.query(`SELECT * FROM boards WHERE id = $1`, [id]);
    return res.rows[0];
  },

  //Add a board
  addBoard: async function (boardTitle, boardDescription, ordering) {
    // const res = await pool.query('INSERT INTO boards VALUES (DEFAULT, $1)', [boardTitle]);
    const res = await pool.query(
      "INSERT INTO boards(id, title, description, ordering) VALUES (DEFAULT, $1, $2, $3)",
      [boardTitle, boardDescription, ordering]
    );
  },

  //Edit a board
  editBoard: async function (boardId, boardTitle, boardDescription, ordering) {
    const q =
      "UPDATE boards SET title = $1 description = $2 ordering = $3 WHERE id = $2";
    const res = await pool.query(q, [
      boardTitle,
      boardDescription,
      ordering,
      boardId,
    ]);
  },

  //Delete a board
  deleteBoard: async function (boardId) {
    const q = "DELETE FROM boards WHERE id=$1";
    const res = await pool.query(q, [boardId]);
  },

  /**
   * TOPICS
   */
  getTopics: async function (id) {
    const res = await pool.query(
      "SELECT * from topics WHERE boardid = $1 ORDER BY last_modified",
      [id]
    );
    return res.rows;
  },

  getTopicCount: async function (id) {
    const res = await pool.query(
      "SELECT COUNT(*) FROM topics WHERE boardid = $1",
      [id]
    );
    return res;
  },

  getTopic: async function (id) {
    const q = "SELECT * FROM topics WHERE id = $1";
    const res = await pool.query(q, [id]);
    return res.rows[0];
  },

  getTopicsByRange: async function (id, start, end) {
    const q =
      "SELECT * FROM topics WHERE boardid = $1  ORDER BY created_at LIMIT $2 OFFSET $3";
    const res = await pool.query(q, [id, end, start]);
    return res.rows;
  },

  addTopic: async function (boardID, question, createdBy, body) {
    try {
      const createTopicQuery = `INSERT INTO topics VALUES (DEFAULT, $1, $2, $3, CURRENT_TIMESTAMP, NUll, CURRENT_TIMESTAMP) RETURNING id`;
      const createTopicRes = await pool.query(createTopicQuery, [
        boardID,
        question,
        createdBy,
      ]);
      const topicID = createTopicRes.rows[0].id;
      const createPostQuery = `INSERT INTO posts VALUES (DEFAULT, $1, $2, $3, 'status', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
      const createPostRes = await pool.query(createPostQuery, [
        createdBy,
        topicID,
        body,
      ]);
    } catch (e) {
      console.log(e);
    }
  },

  deleteTopic: async function (topicId) {
    const q = "DELETE FROM topics WHERE id = $1";
    const res = await pool.query(q, [topicId]);
  },

  getPosts: async function (topicId) {
    const q = `SELECT * FROM posts JOIN public_user_info ON posts.created_by = public_user_info.id WHERE posts.topicid = $1 ORDER BY posts.created_at`;
    // const q = "SELECT * FROM posts WHERE topicid = $1 ORDER BY created_at";
    const res = await pool.query(q, [topicId]);
    return res.rows;
  },

  getPostsByRange: async function (topicId, start, end) {
    const q =
      "SELECT * from posts WHERE topicId = $1 ORDER BY created_at LIMIT $2 OFFSET $3";
    const res = await pool.query(q, [topicId, end, start]);
    return res.rows;
  },

  getPostCount: async function (topicId) {
    const res = await pool.query(
      "SELECT COUNT(*) FROM posts WHERE topicid = $1",
      [topicId]
    );
    return res;
  },

  addPost: async function (topicId, text, userId) {
    //update latest post in topic
    const updated =
      "UPDATE topics SET latest_post = CURRENT_TIMESTAMP WHERE id = $1";
    const updateQuery = await pool.query(updated, [topicId]);
    //add the post
    const q = `INSERT INTO posts VALUES(DEFAULT, $1, $2, $3, 'status', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    const res = await pool.query(q, [userId, topicId, text]);
  },

  editPost: async function (postId, text) {
    const q =
      "UPDATE posts SET body = $1, last_modified = CURRENT_TIMESTAMP WHERE id = $2";
    const res = await pool.query(q, [text, postId]);
  },

  deletePost: async function (postId) {
    //Need to account for latest post field
    const res = await pool.query("DELETE from posts WHERE id = $1", [postId]);
  },

  //profiles

  saveProfilePicture: async function (image, username, imagetype) {
    type = imagetype;
    // Include the imageType field in the UPDATE statement and add a placeholder for it ($3)
    const sqlQuery = `UPDATE users SET profile_image = $1, image_type = $3 WHERE username = $2`;
    // Execute the query with the provided parameters in the correct order
    const res = await pool.query(sqlQuery, [image, username, type]);

    console.log(imagetype);
  },

  // addProfilePicture: async function (username, filename, image) {
  //   const q = 'INSERT INTO userProfiles VALUES($1, $2, $3)'
  //   const query = await pool.query(q, [username, filename, image])
  // },

  // changeProfilePicture: async function(username, filename, image) {
  //   const q = 'UPDATE userProfiles SET image = $1, filename = $2 WHERE username = $3'
  //   const query = await pool.query(q, [image, filename, username])
  // },

  getProfilePicture: async function (username) {
    // const q = 'SELECT * FROM userProfiles WHERE username = $1'
    const q = `SELECT profile_image from users WHERE username = $1`;
    const res = await pool.query(q, [username]);
    return res.rows;
  },

  getProfilePictures: async function () {
    const res = `SELECT * from userProfiles`;
    return res.rows;
  },

  // get user images

  getImages: async function () {
    const query = `SELECT * FROM images`;
    try {
      const res = await pool.query(query);
      return res.rows; // Returns an array of image records
    } catch (err) {
      console.error("Error executing getImages query:", err.stack);
      throw err; // Allows further error handling or logging outside this function
    }
  },

  // save images
  saveImage: async function (
    username,
    filename,
    imageBuffer,
    url,
    postid,
    userid,
    contentType
  ) {
    const query = `INSERT INTO images (username, filename, image, url, postid, userid, content_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    const values = [
      username,
      filename,
      imageBuffer,
      url,
      postid,
      userid,
      contentType,
    ];

    try {
      const res = await pool.query(query, values);
      return res.rows[0]; // Return the inserted image record
    } catch (err) {
      console.error("Error executing saveImage query:", err.stack);
      throw err;
    }
  },

  // get images by userid
  getImagesByUserId: async function (userId) {
    const query = `SELECT * FROM images WHERE userid = $1`;
    try {
      const result = await pool.query(query, [userId]);
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null; // Or however you prefer to handle no results found
      }
    } catch (err) {
      console.error("Error executing getImagesByUserId query:", err.stack);
      throw err;
    }
  },

  // get image by id
  getImageById: async function (imageId) {
    const query = "SELECT * FROM images WHERE id = $1;";
    try {
      const result = await pool.query(query, [imageId]);
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null; // Or however you prefer to handle no results found
      }
    } catch (err) {
      console.error("Error executing getImageById query:", err.stack);
      throw err; // Rethrow or handle as preferred
    }
  },

  // get image by id
  getuserImage: async function (username) {
    const query = "SELECT * FROM users WHERE username=$1";
    try {
      const result = await pool.query(query, [username]);
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null; // Or however you prefer to handle no results found
      }
    } catch (err) {
      console.error("Error executing getImageById query:", err.stack);
      throw err; // Rethrow or handle as preferred
    }
  },
};

module.exports = { helpers };
