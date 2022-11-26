let query = require('../mastodon-queryConversations');

test('tests queryConversations returns results', async () => {
    let result = await query.queryConversations();
    expect(result.length).toBeGreaterThan(0);

    for(let item of result){
        if(item) {
            console.log(item);
        }
    }
});