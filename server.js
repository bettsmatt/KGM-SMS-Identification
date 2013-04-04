var express = require('express')
  , brain   = require('brain')
  , fs      = require('fs')
  , natural = require('natural')
  , file    = require('./fileReader')
  , classifiers = require('./classifiers')
  , app     = express();

jqueryfile = fs.readFileSync("./jquery-1.8.0.min.js")
jquery = jqueryfile.toString()

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

// Start up the Neural Network
var net = new brain.NeuralNetwork();

// Fire up the NLP

tokenizer = new natural.WordTokenizer(),
classifier = new natural.BayesClassifier();
var trained = false;

/*
 * End point for testing a message form data with a message{content} data field
 */
app.post('/test', function(req, res){
	var msg = req.body.message.content;

	// lazy load the classifiers
	if(!trained){
		
		classifiers.trainBayes(classifier, bad, good);
		net = classifiers.trainNN(net, bad, good);

		trained = true;
	}

	// Test both
	outputBayes = classifiers.classifyBayes(classifier, msg)
	outputNN = classifiers.classifyNN(net, msg)
	outputKeywords = classifiers.checkKeywords(keywords, msg);

 	res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
  	bayes: outputBayes,
  	nn: outputNN,
  	keywords: outputKeywords
  }));

 	res.end();

});

/*
 * Scrapping code, to get messages from tfln
 *
 */
var scrapedMessages = [];
app.get('/scrape',function(req,res){
	
	 //Test scrapping code
	 jsdom.env(
	  "http://nodejs.org/dist/",
	  ["http://code.jquery.com/jquery.js"],
	  function (errors, window) {
	  	console.log('Errors'+errors);
	  	console.log('Window'+window);
	    //console.log("there have been", window.$("a").length, "nodejs releases!");
	  }
	);


	// Scrape x amount of pages of text messages from textsfromlastnight
	var numPages = 10;
	for(var i = 0 ; i < numPages ; i ++){
	 
	 jsdom.env({
	   
	    html: 'http://www.textsfromlastnight.com/texts/page:1',
	    src: [ jquery ],
	    done: function (errors, window) {

    		// Find text message elements
        var text = window.$('text p')
        console.log(text);

        // jQuery -> text
        var messages = text.map(function (item) {
        	return item.html();
        });

        // Format into bad messages
        var formatted = messages.map(function(msg){
        	return {data:msg,types:['bad']};
        });

        // Save
        formatted.forEach(function (e,i,a){
        	scrapedMessages.append(e);
        });

        console.log('Scrapped and Saved '+ scrapedMessages.length);
	            
      }

    });
	}

});

// Read files
var bad = file.getBad();
var good = file.getGood();
var keywords = file.getKeywords();


var port = 8080;
app.listen(port);
console.log('Listening on '+port);

