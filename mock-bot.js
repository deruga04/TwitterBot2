var Twit = require("twitter");
var client = new Twit(require("./config"));
var fs = require("fs");

var userID;
var userName;
var specChar = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
var tweetThis = "";

function init()
{
	userName = process.argv[2];
	client.get("users/show", {screen_name: userName}, function(error, user, resp){
		userID = user.id;
		getTweet();
	});
}

function getTweet() 
{
	console.log("Following @" + userName);
	client.stream("statuses/filter", {follow: userID}, function(stream){
		stream.on("data", function(tweet) {
			tweetThis = mockify(tweet.text);
			var image = fs.readFileSync("images/sponge.jpg");
			client.post('media/upload', {media: image}, function(err, media, resp) {
				if (!err)
				{
					client.post("statuses/update", {status: tweetThis + " @" + userName, media_ids: media.media_id_string, in_reply_to_status_id: tweet.id_str}, function(err, data, resp){
							console.log("@" + userName + " " + tweetThis);
					});
				}
			});
		});
		stream.on("error", function(error) {
			console.log(error);
		});
	});
}

function mockify(string) 
{
	var result;
	var random;
	for (var i = 0; i < string.length; i++)
	{
		random = Math.random();
		if (!string[i].match(specChar))
		{
			if (random < 0.5)
			{
				result += string[i].toString().toUpperCase();
			}
			else
			{
				result += string[i].toString().toLowerCase();
			}
		}
		else
		{
			result += string[i];
		}
	}
	return result;
}

function usage(){
	console.log("Usage: node mock-bot.js [username]")
	console.log("username - display name of the user you want to listen to")
	console.log("Program is not exiting...")
}

if (process.argv.length != 3){
	usage();
	process.exit()
}

init();
