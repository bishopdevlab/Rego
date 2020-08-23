module.exports = {
  apps : [{
    name: 'rego',
    script: './be/bin/www',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 80
    },
    env_dev: {
      NODE_ENV: 'development'
    }
  }]
}
