!function() {
    var fs = require('fs');
    /*
     * Read the scrapped messages from tfln, this is easier then adding a libary for non async or waiting till all pages are scraped.
     * It will do for this 'MVP', but should be changed sometime. 
     *
     */

    /*
     * Parse my message dump from s2, these are marked as good messages. Well, a lot better then the ones from tfln...
     *
     */
    this.formatGoodFromPhone = function(debug){

        msgFile = fs.readFileSync("./messages.json")
        msgs = JSON.parse(msgFile.toString());


        debug && console.log(msgs.size);

        formatted = msgs.items.map(function (e,i,a){
          return {data:e.synopsis,types:['safe']}
        });

        debug && console.log('parsed ' +formatted.length + ' messages')

        return formatted;

    }

    /*
     * Read in the JSON dump for good messages
     *
     */
    this.getGood = function(debug){

      msgFile = fs.readFileSync("./good.json")
      msgs = JSON.parse(msgFile.toString());

      debug && console.log('Good:' +msgs.length);

      return msgs;
    }

    /*
     * Read in the JSON dump for bad messages
     *
     */
    this.getBad = function(debug){

      msgFile = fs.readFileSync("./bad.json")
      msgs = JSON.parse(msgFile.toString());

      debug && console.log('Bad:'+msgs.length);

      return msgs;
    }
    
    this.getKeywords = function(){
	    keywordsFile = fs.readFileSync("./keywords.json")
      keywords = JSON.parse(keywordsFile.toString());

      return keywords;
    }

    return module.exports = this;

}();