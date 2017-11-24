const { exportClass } = require('../di');
const token = require('./dependencyService');

class ExampleServiceClass {
    constructor(token) {
        this.token = token;
        this.salt = '$salt_';
    }

    generateSaltedToken() {
        return this.salt + this.token.generateToken();
    }
}

module.exports = {
    ExampleServiceClass,
    exampleService: exportClass([
        token,
    ])(ExampleServiceClass),
};
