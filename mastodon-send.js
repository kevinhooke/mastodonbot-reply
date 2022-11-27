let Mastodon = require('mastodon-api');
let config = require('./config/config-mastodon.json');

exports.postMastodon = async (replyToStatusId, status) => {

    const M = new Mastodon({
        access_token: config['access-token'],
        api_url: 'https://botsin.space/api/v1/',
    });

    let promise = new Promise( (resolve, reject) => M.post('statuses', {
        "status" : status.text,
        "in_reply_to_id" : replyToStatusId
        })
        .then((resp) => {
            console.log(resp.data);
            resolve(resp.data);
        })
    );
    return promise;
}