let query = require('../mastodon-queryMentions');

test('tests queryMentions returns results', async () => {
    let result = await query.queryMentions();
    expect(result.length).toBeGreaterThan(0);

    console.log(`length: ${result.length}`)

    for(let item of result){
        if(item) {
            console.log(item);
        }
    }
});