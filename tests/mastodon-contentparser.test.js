import { extractTextFromContent } from '../mastodon-contentparser.js';

test('extracts text string from html', () => {
    let result = extractTextFromContent('<p>simple</p>');
    expect(result).toBe('simple');
})