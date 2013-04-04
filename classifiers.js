!function() {
    var natural = require('natural')
      , tokenizer = new natural.WordTokenizer();

    this.checkKeywords = function(keywords, sentence){

      if(!(keywords && sentence)) 
          return [];
      
      var msgTokens = tokenizer.tokenize(sentence)
        , matched = [];

      keywords.forEach(function (e,i,a){
        var type = e.type;
        if(!e.words) return;
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

    /*
     * Train the neural network.
     *
     */
    this.trainNN = function(net, bad, good){

      var data = bad.splice(0,20).concat(good.splice(0,20))
        , count = 0;

      // Use NLP to break into keywords
      var training = data.map(function(msg){

        var msgTokens = tokenizer.tokenize(msg.data)
          , input = {}
          , output = {};

        // Make each message into an object, with each token as a field, whos value is the occourance of the word.
        // This forms the input for brain
        // for example {drugs:1}

        msgTokens.forEach(function (e,i,a){
          input[e] = 1;
        });

        // Change tokens into format needed for input
        // Make each type the message is associated with as 1 for the output
        // For example {sexting:1,bullying:1}

        msg.types.forEach(function (e,i,a){
          output[e] = 1
        });

        return {input:input,output:output};
      });

      net.train(training);
      return net;
    }

    // Classify using the Neural Network 
    this.classifyNN = function(net, msg){
      if(!net) throw _argumentError(0, 'net');
      if(!msg) throw _argumentError(1, 'msg');

      var msgTokens = tokenizer.tokenize(msg)
        , input = {}

      msgTokens.forEach(function (e,i,a){
        input[e] = 1;
      });

      return net.run(input);
    }

    // Train the BayesClassifier
    this.trainBayes = function(classifier, bad, good){
      var data = bad.concat(good);

      for(var i = 0 ; i < data.length ; i ++){
        classifier.addDocument(data[i].data, data[i].types[0]);
      }

      classifier.train();
      return classifier;
    }

    // Classify using the BayesClassifier 
    this.classifyBayes = function(classifier, msg){
      if(!classifier) throw _argumentError(0, "classifier");
      if(!msg) throw _argumentError(1, "msg");
      return classifier.classify(msg);
    }


    /*  Private
      ********************/

    function _argumentError(paramIndex, argName) {
        return new Error("Function did not receive parameter " + paramIndex + ": "+argName);
    }

    return module.exports = this;
}();