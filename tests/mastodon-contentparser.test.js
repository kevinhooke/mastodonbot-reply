const { extractTextFromContent } = require('../mastodon-contentparser.js');

test('extracts text string from html', () => {
    let result = extractTextFromContent('<p>simple</p>');
    expect(result).toBe('simple');
})

test('extraxts text from example mastondon reply', () => {
    let result = extractTextFromContent('<p><span class="h-card"><a href="https://botsin.space/@kevinhookebot" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>kevinhookebot</span></a></span> go north</p>');
    expect(result).toBe('go north');
})