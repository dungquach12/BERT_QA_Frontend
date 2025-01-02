const { v4: uuidv4 } = require('uuid');

const generateUUID = () => {
    return uuidv4();
};

console.log(generateUUID());