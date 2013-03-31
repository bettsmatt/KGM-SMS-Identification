var express = require('express');
var brain = require('brain');
var fs = require("fs");
var app = express();

jqueryfile = fs.readFileSync("./jquery-1.8.0.min.js")
jquery = jqueryfile.toString()

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

// Start up the Neural Network
var net = new brain.NeuralNetwork();

// Fire up the NLP
var natural = require('natural'),
tokenizer = new natural.WordTokenizer(),
classifier = new natural.BayesClassifier();
var trained = false;


/*
 * Train the neural network.
 *
 */
function trainNN (){

	var data = bad.splice(0,20).concat(good.splice(0,20));

	var count = 0;

	console.log('Training with : ' + data.length + ' messages');

	// Use NLP to break into keywords
	var training = data.map(function(msg){

		var msgTokens = tokenizer.tokenize(msg.data);
	
		// Make each message into an object, with each token as a field, whos value is the occourance of the word.
  	// This forms the input for brain
  	// for example {drugs:1}

		var input = {}
		msgTokens.forEach(function (e,i,a){
			input[e] = 1;
		});

		// Check
		//console.log(input);

		// Change tokens into format needed for input
		// Make each type the message is associated with as 1 for the output
  	// For example {sexting:1,bullying:1}

  	var output = {}  	
  	msg.types.forEach(function (e,i,a){
  		output[e] = 1
  	});

		// Check
  	//console.log(output);

  	return {input:input,output:output};

	});


	net.train(training);

	console.log('Done training');
	

}

// Classify using the Neural Network 
function classifyNN(msg){

	var msgTokens = tokenizer.tokenize(msg);

	var input = {}
	msgTokens.forEach(function (e,i,a){
		input[e] = 1;
	});

	return net.run(input);

}

// Train the BayesClassifier
function trainBayes(){
	var data = bad.concat(good);

	for(var i = 0 ; i < data.length ; i ++){
		classifier.addDocument(data[i].data, data[i].types[0]);
	}

	classifier.train();

}

// Classify using the BayesClassifier 
function classifyBayes(msg){
	return classifier.classify(msg);
}


/*
 * End point for testing a message form data with a message{content} data field
 */
app.post('/test', function(req, res){
	var msg = req.body.message.content;

	// lazy load the classifyers
	if(!trained){
		
		trainBayes();
		trainNN();

		trained = true;
	}

	// Test both
	outputBayes = classifyBayes(msg)
	outputNN = classifyNN(msg)
	outputKeywords = checkKeywords(keywords, msg);

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

/*
 * Read the scrapped messages from tfln, this is easier then adding a libary for non async or waiting till all pages are scraped.
 * It will do for this 'MVP', but should be changed sometime. 
 *
 */

/*
 * Parse my message dump from s2, these are marked as good messages. Well, alot better then the ones from tfln...
 *
 */
function formatGoodFromPhone(){

		msgFile = fs.readFileSync("./messages.json")
		msgs = JSON.parse(msgFile.toString());


		console.log(msgs.size);

		formatted = msgs.items.map(function (e,i,a){
			return {data:e.synopsis,types:['safe']}
		});

		console.log('parsed ' +formatted.length + ' messages')

		return formatted;

}

/*
 * Read in the JSON dump for good messages
 *
 */
function getGood(){

	msgFile = fs.readFileSync("./good.json")
	msgs = JSON.parse(msgFile.toString());
	console.log('Good:' +msgs.length);

	return msgs;
}

/*
 * Read in the JSON dump for bad messages
 *
 */
function getBad(){

	msgFile = fs.readFileSync("./bad.json")
	msgs = JSON.parse(msgFile.toString());
	console.log('Bad:'+msgs.length);

	return msgs;

}

function getKeywords(){
	keywordsFile = fs.readFileSync("./keywords.json")
	keywords = JSON.parse(keywordsFile.toString());

	return keywords;

}

function checkKeywords(keywords, sentance){
	

	var msgTokens = tokenizer.tokenize(sentance);
 

	var matched = [];

	keywords.forEach(function (e,i,a){

		var type = e.type;

		e.words.forEach(function (keyword,i,a) {

			msgTokens.forEach(function (msgtoken, i, a){

				if(msgtoken === keyword){
					matched.push(type);
				}

			})

		});

	});

	return matched;

}

// Read files
var bad = getBad();
var good = getGood();
var keywords = getKeywords();


var port = 8080;
app.listen(port);
console.log('Listening on '+port);

