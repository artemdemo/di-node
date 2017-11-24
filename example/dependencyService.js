let token = '';

const getToken = () => token;

const generateToken = () => {
    token = Math.floor(Math.random() * 1000);
    return token;
};

module.exports = {
    getToken,
    generateToken,
}