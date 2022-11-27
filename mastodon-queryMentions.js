let config = require('./config/config-mastodon.json');
//let axios = require('axios');
let Mastodon = require('mastodon-api');


exports.queryMentions = async (lastStatusId) => {

    // let axiosMastodon = axios.create({
    //     baseURL: 'https://botsin.space/api/v1/',
    //     headers: {'Authorization': `Bearer ${config['access-token']}`}
    //   });

    //   //conversations are the equiv of DMs on Twitter?
    //   //let result = await axiosMastodon.get('/conversations?limit=10');
    //   //mentions
    //   let result = await axiosMastodon.get('/notifications?limit=10&types=mention');
    //   return result;

    const M = new Mastodon({
        access_token: config['access-token'],
        api_url: 'https://botsin.space/api/v1/',
      });
      let queryString = 'notifications?limit=10&types[]=mention';
      queryString = queryString + ( lastStatusId ? `&since_id=${lastStatusId}` : '');
      
      let promise = new Promise( (resolve, reject) => M.get(queryString)
        .then((resp) => {
            resolve(resp.data);
        })
    );
    return promise;
}