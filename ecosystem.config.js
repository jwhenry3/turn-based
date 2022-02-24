require('dotenv').config()
const mysqlEnv = {
  MYSQL_DB: process.env.MYSQL_DB,
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASS: process.env.MYSQL_PASS,
  MYSQL_PORT: process.env.MYSQL_PORT,}
module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run frontend:dev',
      env: {
        ...mysqlEnv,
        MICROSERVICE_MODULE: '',
      },
    },
    {
      name: 'lobby',
      script: 'npm',
      args: 'run backend:dev',
      env: {
        ...mysqlEnv,
        MICROSERVICE_MODULE: 'lobby',
      },
    },
    {
      name: 'region:home',
      script: 'npm',
      args: 'run backend:dev',
      env: {
        ...mysqlEnv,
        MICROSERVICE_MODULE: 'home-region',
      },
    },
  ],
}
