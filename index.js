var Twitter 	= require('twitter'),
	express 	= require('express'),
	periscope 	= require('node-periscope-stream'),
	app 		= express();
 
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
	response.send('Hello World!');
});

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});

client.stream('statuses/filter', {track: 'LIVE on #Periscope'},  function(stream){
	stream.on('data', function(tweet) {
		if(tweet.entities.urls[0].expanded_url.indexOf('periscope.tv/w/') !== -1) {
			periscope(tweet.entities.urls[0].expanded_url, function(err, details) {	
			if (err) {
		    	console.log(err);
		    	return;
			}
			
			console.log(details);
		});
		}
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});