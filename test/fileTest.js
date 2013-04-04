var assert = require('assert')
  , file   = require('../fileReader');

describe("fileIO", function() {
    it("should return a defined list of one to many objects", function () {
        var returnedList = file.formatGoodFromPhone();
        assert(typeof returnedList === 'object', "returned value is not object-ish");
        assert(returnedList.hasOwnProperty('length'), "the returned value did not hav property list");
        assert(returnedList.length > 0, "The length of good from phone was 0");
    });
});

describe("fileIO", function() {
    it("should return a defined list of one to many 'good' objects", function() {
        var returnedList = file.getGood();
        assert(typeof returnedList === 'object', "returned value is not objectish");
        assert(returnedList.hasOwnProperty("length"), "returned value is not listish");
        assert(returnedList.length > 0, "returned value has length 0");
    });
});

describe("fileIO", function() {
    it("should return a defined list of one to many 'good' objects", function() {
        var returnedList = file.getBad();
        assert(typeof returnedList === 'object', "returned value is not objectish");
        assert(returnedList.hasOwnProperty("length"), "returned value is not listish");
        assert(returnedList.length > 0, "returned value has length 0");
    });
});

describe("fileIO", function() {
    it("should return a defined list of one to many 'good' objects", function() {
        var returnedList = file.getKeywords();
        assert(typeof returnedList === 'object', "returned value is not objectish");
        assert(returnedList.hasOwnProperty("length"), "returned value is not listish");
        assert(returnedList.length > 0, "returned value has length 0");
    });
});

describe("fileIO", function() {
    it("should only return type good from getGood()", function() {
        var returnedList = file.getGood(), i, j, len, types;
        for(i = 0, len = returnedList.length; i < len; i++) {
            assert(returnedList[i].hasOwnProperty("types"), "did not return type information");
            types = returnedList[i]["types"];
            for(j = 0; j < types.length; j++) {
                assert(types[j] === "good", "returned non-good type");
            }
        }
    });
});

describe("fileIO", function() {
    it("should only return type bad from getBad()", function() {
        var returnedList = file.getBad(), i, j, len, types;
        for(i = 0, len = returnedList.length; i < len; i++) {
            assert(returnedList[i].hasOwnProperty("types"), "did not return type information");
            types = returnedList[i]["types"];
            for(j = 0; j < types.length; j++) {
                assert(types[j] === "bad", "returned non-bad type");
            }
        }
    });
});

