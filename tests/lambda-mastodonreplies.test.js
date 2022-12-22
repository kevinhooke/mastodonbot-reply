/**
 * Run with jest, not 'npm run test' which is configured
 * to test ES modules imported for contentparser.
 * 
 */
//mock dynamodb lookup for last processed reply id
const lastStatusQuery = require('../db_status.js');
lastStatusQuery.getLastDbStatus = jest.fn();

//mock mastodon api query for mentions
const mastodonReplies = require('../mastodon-queryMentions.js');
mastodonReplies.queryMentions = jest.fn();

test('tests processing 1 mention since last processed', async () => {
    lastStatusQuery.getLastDbStatus.mockResolvedValue(
        {"Items":[{"statusKey":"lastStatusId","lastReplyId":"1"}],"Count":1,"ScannedCount":1}
    );

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

    lastStatusQuery.getLastDbStatus.mockResolvedValue(
        {"Items":[{"statusKey":"lastStatusId","lastReplyId":"1"}],"Count":1,"ScannedCount":1}
    );

    //mock mastodon api query for mentions
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
    expect(results.status).toBe('No replies processed');
});

test('tests 0 mentions since last processed', async () => {
    //mock dynamodb lookup for last processed reply id;
    lastStatusQuery.getLastDbStatus.mockResolvedValue(
        {"Items":[{"statusKey":"lastStatusId","lastReplyId":"1"}],"Count":1,"ScannedCount":1}
    );

    //mock mastodon api query for mentions - return 0 results
    mastodonReplies.queryMentions.mockResolvedValue([]);

    let lambda = require('../lambda-mastodonreplies.js');
    let results = await lambda.handler();
    expect(results.status).toBe('No replies since last check');
});

test('adventure reply parses go request from reply text', async () => {

    //mock dynamodb lookup for last processed reply id
    lastStatusQuery.getLastDbStatus.mockResolvedValue(
        {"Items":[{"statusKey":"lastStatusId","lastReplyId":"1"}],"Count":1,"ScannedCount":1}
    );

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
            'content': '<p><span class="h-card"><a href="https://botsin.space/@kevinhookebot" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>kevinhookebot</span></a></span> go north</p>'
            }
        }
    ]);

    let lambda = require('../lambda-mastodonreplies.js');
    let results = await lambda.handler();
    expect(results.status).toBe('Replies processed');
})