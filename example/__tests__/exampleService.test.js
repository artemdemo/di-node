const { expect } = require('chai');
const { ExampleServiceClass } = require('../exampleService');
const { exportClass } = require('../../di');

const tokenMock = {
    generateToken() {
        return 'tokenMock';
    }
};
const exampleService = exportClass([
    tokenMock,
])(ExampleServiceClass);

describe('exampleService', () => {
    it('should generate salted token', () => {
        expect(exampleService.generateSaltedToken()).to.equal('$salt_tokenMock');
    });
});