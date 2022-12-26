let tracery = require('tracery-grammar');
let parser = require('./mastodon-contentparser.js');

exports.adventureTextRequested = function(replyText){
    let result = '';

    if(replyText != null) {

        //extract text from HTML reply
        replyText =  parser.extractTextFromContent(replyText);

        //strip @kevinhookebot
        console.log(`Before removing @:${replyText}`);
        replyText = replyText.replace(/@[\s]+kevinhookebot/, '');
        replyText = replyText.trim();
        console.log(`...after removing @:${replyText}`);

        if (replyText.indexOf('go ') == 0) {
            let words = replyText.split(' ');

            for (var i = 0; i < words.length; i++) {
                console.log('word: ' + words[i]);
            }
            if (words.length >= 2 &&
                ( words[1] === 'north' ||
                    words[1] === 'south' ||
                    words[1] === 'east' ||
                    words[1] === 'west' ||
                    words[1] === 'up' ||
                    words[1] === 'down'
                )
            ) {
                result = words[1];
            }
        }
    }
    return result;
}

exports.generateTextAdventure = function() {

    var grammar = tracery.createGrammar({
        'direction': ['North', 'South', 'East', 'West'],
        'where': ['in', 'on', 'inside', 'in front of', 'at'],
        'placeadj': ['enormous', 'sizable', 'ample', 'modest', 'humble', 'damp', 'cramped'],
        'place': ['field', 'lake', 'woodland glen', 'forest', 'open space', 'cave', 'church',
            'hole in the ground', 'building', 'starship', 'convenience store', 'museum', 'library', 'shop', 'restaurant', 'fork in the road', 'kebab shop'],
        'verb1': ['looks', 'smells', 'sounds', 'feels', 'tastes', 'appears'],
        'verb1adj': ['most atypical', 'funky', 'fetid', 'worn out', 'intriguing', 'unfamiliar', 'conspicuous',
            'glowing', 'dirty', 'second-hand', '18th Century', 'newly constructed', 'recently abandoned', 'out of place', 'misaligned'],
        'simile1': ['created', 'just discovered', 'destroyed', 'materialized', 'that just arrived', 'that just departed', 'depcomposing'],
        'simile2': ['today', 'yesterday', 'a significant time ago', 'in the past'],
        'person': ['Herman', 'Percy', 'Reginald', 'Margaret', 'Lucile', 'Bob'],
        'verb2': ['dances', 'walks', 'waltzes', 'hops', 'stumbles', 'runs', 'strolls', 'peers', 'escapes'],
        'movement': ['towards', 'away from', 'into', 'from', 'inside'],
        'movement2': ['from', 'composed from', 'belonging to', 'created by', 'of', 'comprised of', 'extracted from', 'distilled from'],
        'location': ['oblivion', 'certain death', 'you', 'the distance', 'the setting sun', 'the future', 'the past', 'another dimension', 'the spaceship',
            'tomorrow', 'yesterday', 'the 4th dimension', 'another time', 'a parallel dimension',
            'a rip in spacetime', 'the fabric of time', 'a startling conclusion', 'butterflies', 'cheese', 'cabbage', 'bananas', 'jam', 'chicken curry',
            'tuna fish', 'stagnant water', 'chocolate'],
        'noun': ['a horse', 'a puppet', 'a dog', 'a golden lamp', 'a leather bound book', 'a rusty bucket', 'an old shoe', 'an amulet', 'an orb',
            'a burrito', 'a taco', 'a pizza', 'a bike', 'a skateboard', 'a pair of boots', 'a telescope', 'an odd sock', 'someone\'s lost time', 'a fish',
            'a monkey'],
        'verb3': ['look around', 'look up', 'look down'],
        'story': ['You are #where# a #verb1adj# #placename#. The #placename# #verb1# #verb1adj#, like #noun# #movement2# #location#. #person# #verb2# #movement# #location#. You #verb3# and see #noun#.'],
        'origin': ["#[placename:#place#]story#"]
    });

    grammar.addModifiers(tracery.baseEngModifiers);
    let result = grammar.flatten('#origin#');
    console.log(result);
    return result;
}