let config = require('./config/config-mastodon.json');
//let axios = require('axios');
let Mastodon = require('mastodon-api');


exports.queryMentions = async () => {

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
  
      let promise = new Promise( (resolve, reject) => M.get('notifications?limit=10&types[]=mention')
        .then((resp) => {
            resolve(resp.data);
        })
    );
    return promise;
}