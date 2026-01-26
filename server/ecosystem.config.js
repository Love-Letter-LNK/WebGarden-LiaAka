module.exports = {
    apps: [{
        name: "liaaka-server",
        script: "./index.js",
        env_production: {
            NODE_ENV: "production",
            PORT: 3001
        },
        env_development: {
            NODE_ENV: "development",
            PORT: 3001
        }
    }]
}
