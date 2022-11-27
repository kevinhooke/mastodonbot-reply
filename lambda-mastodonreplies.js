let lastStatusQuery = require('./db_status.js');
let replytext = require('./replyMessages.json');
let textadventure = require('./textadventure');
let mastodonReplies = require('./mastodon-queryMentions.js');
let mastodonSend = require('./mastodon-send.js');
let config = require('./config/config-mastodon.json');

exports.handler = async (event) => {

    console.log('lambda-mastodonreplies called');

    let data = await lastStatusQuery.getLastDbStatus('lastStatusId');

        console.log("Retrieved from table, data: " + JSON.stringify(data));
        let lastRepliedToStatusId = 0;
        if(data != undefined && data.Count > 0){
            lastRepliedToStatusId = data.Items[0].lastReplyId;
        }

        console.log("lastRepliedToStatusId: " + lastRepliedToStatusId);

        //get last status id that was replied to then pass to Mastodon /notifications query
        let lastReplies = await mastodonReplies.queryMentions(lastRepliedToStatusId);
        console.log(`Last replies since id [${lastRepliedToStatusId}] : ${lastReplies.length}`);
        if(lastReplies.length > 0){
            //reply to first found in list, process any other replies later on next run
            let mostRecentIdRepliedTo = 0;
            for(let reply of lastReplies){
                if(reply.id > lastRepliedToStatusId){
                    console.log(`Reply id [${reply.id}] is after last acknowledged id: ${lastRepliedToStatusId}`);
                    if(reply.id > mostRecentIdRepliedTo){
                        mostRecentIdRepliedTo = reply.id;
                    }

                    let replyToBotText = '';
                    let textReply = '';
            
                    var direction = textadventure.adventureTextRequested(replyToBotText);
                    if(direction !== ''){
                        textReply = 'You go ' + direction
                            + '. ' + textadventure.generateTextAdventure(replyToBotText);
                    }
                    else{
                        textReply = module.exports.getTextReply();
                    }
            
                    var status = ({
                        'text': textReply
                    });
            
                    if (config['send-enabled'] === "true") {
                        console.log("config.send-enabled: true: sending reply ...");
            
                        //send reply with Mastodon api
                        //TODO test
                        mastodonSend.postMastodon(reply.status.id, status);
                    }
                    else {
                        console.log("config.send-enabled: false, not sending reply");
                    }
                    console.log("reply: " + JSON.stringify(status));
            
                    //TODO get id of last replied to and update in table
                    let lastIdRepliedTo = 'todo';
                    
                    
                }
                else{
                    console.log(`Reply id [${reply.id}] is before last acknowledged id: ${lastRepliedToStatusId}, ignoring`);
                }
            }

            if(mostRecentIdRepliedTo > 0){
                //update last replied to id with the most recent (highest) in this last processed group
                lastStatusQuery.updateDbStatus('lastStatusId', mostRecentIdRepliedTo);
            }
        }
        else{
            console.log("... no more recent statuses yet, skipping");
        }

}

exports.nextIntInRange = function(high){
    let next = Math.floor(Math.random() * high);
    console.log('next: ' + next);
    return next;
}

exports.getTextReply = function(){
    let next = this.nextIntInRange(31);
    console.log('next msg index: ' + next);
    let nextMsg = replytext[next];
    console.log('Next msg: ' + nextMsg);
    return nextMsg;
}