import { stripHtml } from 'string-strip-html';

export const extractTextFromContent = (text) => {

    let result = stripHtml(text).result;
    return result;
}