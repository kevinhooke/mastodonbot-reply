let config = require('./config/config-mastodon.json');
let axios = require('axios');
const { ungzip } = require('node-gzip');
let Mastodon = require('mastodon-api');

exports.queryTimeline = async () => {

    // let axiosMastodon = axios.create({
    //     baseURL: 'https://botsin.space/api/v1',
    //     headers: {
    //       'Authorization': `Bearer ${config['access-token']}`,
    //       'Accept-Encoding': 'gzip'
    //     }
    //   });

    //   let result = await axiosMastodon.get('/timelines/home',
    //     { 'decompress': true, responseType: "arraybuffer" });

    //   let decompressed = await ungzip(result.data);

    //let result = await request.get('https://botsin.space/api/v1/timelines/home');
    //return result;

    const M = new Mastodon({
      access_token: config['access-token'],
      api_url: 'https://botsin.space/api/v1/',
    });

    let promise = new Promise( (resolve, reject) => M.get('timelines/home?limit=10')
      .then((resp) => {
          resolve(resp.data);
      })
  );
  return promise;
}