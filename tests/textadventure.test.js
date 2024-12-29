let textadventure = require('../textadventure.js');

test('go with direction results in requested directio', () => {
    let result = textadventure.adventureTextRequested('go north');
    console.log(`Result: ${result}`);
    expect(result).toBe('north');
})

test('go with direction results in direction move', () => {
    let result = textadventure.generateTextAdventure('north');
    console.log(`Result: ${result}`);
    expect(result.startsWith('You are')).toBeTruthy();
})