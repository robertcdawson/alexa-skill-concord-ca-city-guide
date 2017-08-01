var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Concord California";

var numberOfResults = 3;

var welcomeMessage = location + " Guide. You can ask me for an attraction or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction or  say help. What will it be?";

var locationOverview = "Concord, California is is the largest city in Contra Costa County, California. At the 2010 census, the city had a population of 122,067 making it the 8th largest city in the San Francisco Bay Area. ";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do.  What would you like to do?";

var moreInformation = "See your Alexa app for more information."

var tryAgainMessage = "Please try again."

var noAttractionErrorMessage = "What attraction was that? " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example, open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

// var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Markham Regional Arboretum", content: "A natural arboretum founded in 1981 and a work in progress. Most of the site remains in a natural state.", location: "Located at 1202 La Vista Avenue in Concord, California.", contact: "925 681 2968" },
    { name: "Six Flags Waterworld Concord", content: "A water park developed, owned and operated by Premier Parks, currently owned by EPR Properties, and operated by Six Flags.", location: "Located at 1950 Waterworld Parkway in Concord, California.", contact: "925 609 1364" },
    { name: "Concord Pavilion", content: "Amphitheater, a major regional concert venue formerly known as the Sleep Train Pavilion and as the Chronicle Pavilion at Concord.", location: "Located at 2000 Kirker Pass Road in Concord, California.", contact: "925 676 8742" },
    { name: "Newhall Community Park", content: "Public park set around a creek, with trails, a dog run and picnic areas, plus bocce courts & ballfields.", location: "Located at 1351 Newhall Parkway in Concord, California.", contact: "925 671 3404" },
    { name: "West Wind Solano Drive-In Theater", content: "A drive-in movie theater that also offers a concession stand for snacks and a playground for kids.", location: "Located at 1611 Solano Way in Concord, California.", contact: "925 825 1951" }
];

var topFive = [
    { number: "1", caption: "Visit the Markham Regional Arboretum to learn about the natural surroundings and other science-related topics.", more: "Today Markham Nature Park and Arboretum is a place of quiet beauty less than 20 blocks from downtown Concord.", location: "1202 La Vista Avenue, Concord, California 94521", contact: "925 681 2968" },
    { number: "2", caption: "Have a blast at Six Flags Waterworld Concord.", more: "Rides and slides. Waves, rivers, and pools. Attractions just for kids.", location: "1950 Waterworld Parkway, Concord, California 94520", contact: "925 609 1364" },
    { number: "3", caption: "Watch a live concert at the Concord Pavilion.", more: "The Pavilion was designed by architect Frank Gehry and landscape architect Peter Walker.", location: "2000 Kirker Pass Road Concord, California 94521", contact: "925 676 8742" },
    { number: "4", caption: "Newhall Community Park", more: "126 acres along Galindo Creek east of Treat Boulevard. Approximately 30 acres of park is improved with ponds along the creek, a play structure, picnic areas, bocce courts, and turfed athletic fields.", location: "1351 Newhall Pkwy, Concord, California 94521", contact: "925 671 3404" },
    { number: "5", caption: "West Wind Solano Drive-In Theater", more: "The drive-in theatre experience first came to light on June 6, 1933. West Wind has been family owned and operated from day one.  We opened our first drive-in theatre in 1952 and today we own and operate the largest drive-in theatre chain in the world with four in California, one in Arizona and two in Nevada.", location: "1611 Solano Way, Concord, California 94520", contact: "925 825 1951" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    // 'getNewsIntent': function () {
    //     this.handler.state = states.SEARCHMODE;
    //     this.emitWithState('getNewsIntent');
    // },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = locationOverview;
        this.emit(':tellWithCard', output, location, locationOverview);
    },
    'getAttractionIntent': function () {
        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },
    'getTopFiveIntent': function () {
        output = topFiveIntro;
        var cardTitle = "Top Five Things To See in " + location;

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }
        output += topFiveMoreInfo;
        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    // 'getNewsIntent': function () {
    //     httpGet(location, function (response) {

    //         // Parse the response into a JSON object ready to be formatted.
    //         var responseData = JSON.parse(response);
    //         var cardContent = "Data provided by New York Times\n\n";

    //         // Check if we have correct data, If not create an error speech out to try again.
    //         if (responseData == null) {
    //             output = "There was a problem with getting data please try again";
    //         }
    //         else {
    //             output = newsIntroMessage;

    //             // If we have data.
    //             for (var i = 0; i < responseData.response.docs.length; i++) {

    //                 if (i < numberOfResults) {
    //                     // Get the name and description JSON structure.
    //                     var headline = responseData.response.docs[i].headline.main;
    //                     var index = i + 1;

    //                     output += " Headline " + index + ": " + headline + ";";

    //                     cardContent += " Headline " + index + ".\n";
    //                     cardContent += headline + ".\n\n";
    //                 }
    //             }

    //             output += " See your Alexa app for more information.";
    //         }

    //         var cardTitle = location + " News";

    //         alexa.emit(':tellWithCard', output, cardTitle, cardContent);
    //     });
    // },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = 0;
        if(this.event.request.intent.slots.attraction ) {
            if (this.event.request.intent.slots.attraction.value) {
                slotValue = this.event.request.intent.slots.attraction.value;

            }
        }

        if (slotValue > 0 && slotValue <= topFive.length) {

            var index = parseInt(slotValue) - 1;
            var selectedAttraction = topFive[index];

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

String.prototype.trunc =
    function (n) {
        return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
    };
