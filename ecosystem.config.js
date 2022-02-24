require('dotenv').config()
module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run frontend:dev',
      env: {
        ...process.env,
        MICROSERVICE_MODULE: '',
      },
    },
    {
      name: 'lobby',
      script: 'npm',
      args: 'run backend:dev',
      env: {
        ...process.env,
        MICROSERVICE_MODULE: 'lobby',
      },
    },
    {
      name: 'region:home',
      script: 'npm',
      args: 'run backend:dev',
      env: {
        ...process.env,
        MICROSERVICE_MODULE: 'home-region',
      },
    },
  ],
}
