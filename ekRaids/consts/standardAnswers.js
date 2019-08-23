const standard_answers = {
    ['english']:{
                ['sorry']:
                    {
                        'bad_image_processing':'Thanks for your help. Unfortunately we are unable to process your image'+
                        ' at this time. Every image you share helps us to create a better model'+
                        'for our community bot. We appreciate your help!',
                        'could_not_get_gym':'Thanks for sharing this raid information with us. Unfortunately we were unable to find the gym in our database. We will review the information you provided'+
                            ' and we will try to fix this issue for the future. We appreciate your help.',
                        'could_not_get_boss':'Thanks for sharing this raid information with us. Unfortunately we were unable to find the raid boss in our database. We will review the information you provided'+
                            ' and we will try to fix this issue for the future. We appreciate your help.',
                        'could_not_understand':'Sorry the inconvenience. I was not able to process your message. Our team will work on fixing this problem',
                    },
                ['greetings']:
                    {
                        'bots_bio':'I am a simple chat bot created to help PokemonGo trainers in ' +
                        'the Elkhart area.  At this moment I can provide you with general raids information (i.e. raid times, active groups,' +
                        'current bosses, etc). I can also help you locate quests rewarding specific items/mons.',
                        'bot_greeting':' Thanks for reaching out to us. Unfortunately no humans are available to assist ' +
                        'you at this moment. However, we will try our best to get back at you as' +
                        'soon as possible.  In the meantime perhaps I could assist you? ',
                        'bot_does_not_understand_default_message':' Sorry I could not comprehend your message.'+
                        'My programmer is lazy, and has not trained me for this situation...He dumb AF.',

                    },
                }

};

module.exports ={
    standard_answers
};