test('tests processing 1 mention since last processed', async () => {
    //mock dynamodb lookup for last processed reply id
    let lastStatusQuery = require('../db_status.js');
    jest.mock('../db_status.js');
    lastStatusQuery.getLastDbStatus.mockResolvedValue(
        {"Items":[{"statusKey":"lastStatusId","lastReplyId":"1"}],"Count":1,"ScannedCount":1}
    );

    //mock mastodon api query for mentions
    let mastodonReplies = require('../mastodon-queryMentions.js');
    jest.mock('../mastodon-queryMentions.js');
    mastodonReplies.queryMentions.mockResolvedValue([
        {
            'id': '2',
            'type': 'mention',
            'created_at': '2022-11-27T03:24:08.275Z',
            'account': {
                id: 111111,
                'acct': 'mockuser'
            },
            'status': {
            'id': '112233',
            'content': 'test status1'
            }
        }
    ]);

    let lambda = require('../lambda-mastodonreplies.js');
    let results = await lambda.handler();
    expect(results.status).toBe('Replies processed');
});

test('tests 1 mention with same id as last processed, skips processing', async () => {
    //mock dynamodb lookup for last processed reply id
    let lastStatusQuery = require('../db_status.js');
    jest.mock('../db_status.js');
    lastStatusQuery.getLastDbStatus.mockResolvedValue(
        {"Items":[{"statusKey":"lastStatusId","lastReplyId":"1"}],"Count":1,"ScannedCount":1}
    );

    //mock mastodon api query for mentions
    let mastodonReplies = require('../mastodon-queryMentions.js');
    jest.mock('../mastodon-queryMentions.js');
    mastodonReplies.queryMentions.mockResolvedValue([
        {
            'id': '1',
            'type': 'mention',
            'created_at': '2022-11-27T03:24:08.275Z',
            'account': {
                id: 111111,
                'acct': 'mockuser'
            },
            'status': {
            'id': '112233',
            'content': 'test status1'
            }
        }
    ]);

    let lambda = require('../lambda-mastodonreplies.js');
    let results = await lambda.handler();
    expect(results.status).toBe('No replies since last check');
});

test('tests 0 mentions since last processed', async () => {
    //mock dynamodb lookup for last processed reply id
    let lastStatusQuery = require('../db_status.js');
    jest.mock('../db_status.js');
    lastStatusQuery.getLastDbStatus.mockResolvedValue(
        {"Items":[{"statusKey":"lastStatusId","lastReplyId":"1"}],"Count":1,"ScannedCount":1}
    );

    //mock mastodon api query for mentions - return 0 results
    let mastodonReplies = require('../mastodon-queryMentions.js');
    jest.mock('../mastodon-queryMentions.js');
    mastodonReplies.queryMentions.mockResolvedValue([]);

    let lambda = require('../lambda-mastodonreplies.js');
    let results = await lambda.handler();
    expect(results.status).toBe('No replies since last check');
});