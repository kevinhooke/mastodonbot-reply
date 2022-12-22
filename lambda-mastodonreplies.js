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

        let repliesProcessed = 0;
        if(lastReplies.length > 0){
            //reply to first found in list, process any other replies later on next run
            let mostRecentIdRepliedTo = 0;
            for(let reply of lastReplies){
                if(reply.id > lastRepliedToStatusId){
                    let replyToAccount = reply.account.acct;
                    console.log(`Reply id [${reply.id}] is after last acknowledged id: ${lastRepliedToStatusId} from: ${replyToAccount}`);
                    if(reply.id > mostRecentIdRepliedTo){
                        mostRecentIdRepliedTo = reply.id;
                    }

                    let replyToBotText = reply.status.content;
                    console.log(`reply text: ${replyToBotText}`);
                    let textReply = `@${replyToAccount} `;
            
                    var direction = textadventure.adventureTextRequested(replyToBotText);
                    if(direction !== ''){
                        textReply = textReply + 'You go ' + direction
                            + '. ' + textadventure.generateTextAdventure(replyToBotText);
                    }
                    else{
                        textReply = textReply + module.exports.getTextReply();
                    }
            
                    var status = ({
                        'text': textReply
                    });
            
                    if (config['send-enabled'] === "true") {
                        console.log("config.send-enabled: true: sending reply ...");
            
                        //send reply with Mastodon api
                        let result = await mastodonSend.postMastodon(reply.status.id, status);
                        console.log(`postMastodon result: ${result}`);
                    }
                    else {
                        console.log("config.send-enabled: false, not sending reply");
                    }
                    console.log("reply: " + JSON.stringify(status));
                    repliesProcessed = repliesProcessed + 1;
                }
                else{
                    console.log(`Reply id [${reply.id}] is before last acknowledged id: ${lastRepliedToStatusId}, ignoring`);
                }
            }

            if(mostRecentIdRepliedTo > 0){
                //update last replied to id with the most recent (highest) in this last processed group
                if(config['send-enabled'] === 'true'){
                    let updateResult = await lastStatusQuery.updateDbStatus('lastStatusId', mostRecentIdRepliedTo);
                    console.log(`updateDbStatus result: ${JSON.stringify(updateResult)}`);
                }
                else{
                    console.log('Skipping updateDbStatus, config.send-enabled is false');
                }
            }
        }
        else{
            console.log("... no more recent statuses yet, skipping");
        }
        
        let result = {
            status: '',
            repliesProcessed: repliesProcessed
        }
        if(lastReplies.length === 0){
            result.status = 'No replies since last check';
        }
        else if(repliesProcessed > 0){
            result.status = 'Replies processed';
        }
        else{
            result.status = 'No replies processed';
        }
        return result;
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