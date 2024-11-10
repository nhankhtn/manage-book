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

module.exports = {
    generateSlug,
}