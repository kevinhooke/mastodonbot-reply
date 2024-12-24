let textadventure = require('./textadventure');

test('go with direction results in directional response', () => {
    let result = textadventure.adventureTextRequested('go north');
    expect(result).toContain('You go north');
})