var express = require('express');
var brain = require('brain');
//var jsdom  = require('jsdom');
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
tokenizer = new natural.WordTokenizer();



/*
 * End point for training the neural network, just one big text area of json data.
 *
 * In the format: [{text,[type]}]
 *
 */
app.post('/train', function(req, res){
	console.log('training')

	var dataRaw = req.body.message.data;
	console.log(dataRaw);

	// Parse
	var data = JSON.parse(dataRaw);
	console.log(data);

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
		console.log(input);

		// Change tokens into format needed for input
		// Make each type the message is associated with as 1 for the output
  	// For example {sexting:1,bullying:1}

  	var output = {}  	
  	msg.types.forEach(function (e,i,a){
  		output[e] = 1
  	});

  	console.log(output);

  	return {input:input,output:output};

	});

	training.forEach(function (e,i,a) {

		console.log(e);

	});

	// Magic goes here
	// This is the brain example for is text should be black and white on different background colors 
	// net.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
  //         {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
  //         {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}]);
	//var output = net.run({ r: 1, g: 0.4, b: 0 });  // { white: 0.99, black: 0.002 }

	// We substiture this for our data
	net.train(training);

	console.log('done');
	
	// Responce
  var body = 'Your AI had been trained :)'
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);

});


/*
 * End point for testing a message form data with a message{content} data field
 */
app.post('/test', function(req, res){

	var msg = req.body.message;
	console.log('Received:' + msg.content);

	// turn message into the same format as above
	var msgTokens = tokenizer.tokenize(msg.content);
	
	// Make each message into an object, with each token as a field, whos value is the occourance of the word.
  // This forms the input for brain
  // for example {drugs:1}

	var input = {}
	msgTokens.forEach(function (e,i,a){
		input[e] = 1;
	});


	var output = net.run(input);

	// Magic happens here
	console.log(output);
  var body = '<h1>Message</h1> + <p>' +msg.content +'</p>' + '<h1>Classification</h1><p>'+ JSON.stringify(output)+'</p>';

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);

});

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
app.get('/bad',function (req,res){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(scrapedMessages));
  res.end();
});

/*
 * Parse my message dump from s2, these are marked as good messages. Well, alot better then the one from tfln...
 *
 */
app.get('/good', function (req,res){

	msgFile = fs.readFileSync("./messages.json")
	msgs = JSON.parse(msgFile.toString());

	console.log(msgs.size);

	formatted = msgs.items.map(function (e,i,a){
		return {data:e.synopsis,types:['safe']}
	});

	console.log('parsed ' +formatted.length + ' messages')

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(formatted));
  res.end();

});

var port = 8080;
app.listen(port);
console.log('Listening on '+port);

