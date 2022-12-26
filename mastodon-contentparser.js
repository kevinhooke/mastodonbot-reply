const { stripHtml}  = require('string-strip-html');

exports.extractTextFromContent = (text) => {

    let result = stripHtml(text).result;
    return result;
}