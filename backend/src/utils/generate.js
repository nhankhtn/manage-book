const slugify = require('slugify');

function generateSlug(string) {
    if (!string) {
        return '';
    }
    return slugify(string, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
    });
}

const generateID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

module.exports = {
    generateSlug,
    generateID,
}