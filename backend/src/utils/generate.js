const slugify = require('slugify');

function generateSlug(string) {
    return slugify(string, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
    });
}

module.exports = {
    generateSlug,
}