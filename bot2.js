console.log("The bot is starting");

var Twit = require("twit");
var config = require("./config");
var T = new Twit(config);

var num = 865;

tweetIt();
setInterval(tweetIt, 1000 * 60);

function tweetIt() {
	
	var tweet = {
		status: "counting to infinity: " + num
	}

	T.post("statuses/update", tweet, tweeted);

	function tweeted(err, data, response){
			num = num + 1;
	}
}