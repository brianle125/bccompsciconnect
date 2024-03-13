const {Connection} = require('tedious');
const {Connector} = require('@google-cloud/cloud-sql-connector');

// In case the PRIVATE_IP environment variable is defined then we set
// the ipType=PRIVATE for the new connector instance, otherwise defaults
// to public ip type.
const getIpType = () =>
  process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === 'true'
    ? 'PRIVATE'
    : 'PUBLIC';

// connectWithConnector initializes a TCP connection
// to a Cloud SQL instance of SQL Server.
const connectWithConnector = async config => {
  const connector = new Connector();
  const clientOpts = await connector.getTediousOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
    ipType: getIpType(),
  });
  const dbConfig = {
    server: '0.0.0.0', // e.g. '127.0.0.1'
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USER, // e.g. 'my-db-user'
        password: process.env.DB_PASS, // e.g. 'my-db-password'
      },
    },
    options: {
      ...clientOpts,
      port: 5432,
      database: process.env.DB_NAME, // e.g. 'my-database'
      useColumnNames: true,
    },
    // ... Specify additional properties here.
    ...config,
  };

  // Establish a connection to the database.
  return new Connection(dbConfig);
};
 
module.exports = { connectWithConnector }