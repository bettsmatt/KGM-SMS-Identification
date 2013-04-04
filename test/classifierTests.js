var assert = require('assert')
  , classifier = require('../classifiers')

describe("classifiers", function() {
    it("it should return empty on both empty", function() {
        var matched = classifier.checkKeywords([{}], "");
        assert(matched, "matched is undefined");
        assert(matched.length == 0, "matched is non-zero");
    });
});

describe("classifiers", function() {
    it("it should return empty on empty keywords", function() {
        var matched = classifier.checkKeywords([{}], "some random other sentence");
        assert(matched, "matched is undefined");
        assert(matched.length == 0, "matched is non-zero");
    });
});

describe("classifiers", function() {
    it("it should return empty on empty sentence", function() {
        var matched = classifier.checkKeywords([{type:"test", words:["a", "test"]}], "");
        assert(matched, "matched is undefined");
        assert(matched.length == 0, "matched is non-zero");
    });
});

describe("classifiers", function() {
    it("it should return empty on undefined", function() {
        var matched = classifier.checkKeywords();
        assert(matched, "matched is undefined");
        assert(matched.length == 0, "matched is non-zero");
    });
});


describe("classifiers", function() {
    it("it should match sentence to keyword", function() {
        var matched = classifier.checkKeywords([{type:"test", words:["keyword"]}], "sentence with keyword");
        assert(matched, "matched is undefined");
        assert(matched.length == 1, "matched is not one element");
        assert(matched[0] == 'test', "did not match keyword");
    });
});


describe("classifiers", function() {
    it("it should match multiple types", function() {
        var matched = classifier.checkKeywords(
            [{type:"test", words:["keyword"]}, 
             {type:"foo", words:["with"]}], 
            "sentence with keyword");

        assert(matched, "matched is undefined");
        assert(matched.length == 2, "matched is not one element");
        assert(matched.indexOf("test") != -1, "did not match keyword");
        assert(matched.indexOf("foo") != -1, "did not match keyword");
    });
});

describe("classifiers", function() {
    it("should throw appropriate exceptions for undefined net", function() {
        try {
            classifier.classifyNN();
        } catch(e) {
            assert(e !== undefined, "didn't throw");
            assert(e.message == "Function did not receive parameter 0: net", "bad error message");
        }            
    });
});

describe("classifiers", function() {
    it("should throw appropriate exceptions for undefined msg", function() {
        try {
            classifier.classifyNN({});
        } catch(e) {
            assert(e !== undefined, "didn't throw");
            assert(e.message == "Function did not receive parameter 1: msg", "bad error message");
        }            
    });
});

describe("classifiers", function() {
    it("should throw on bayes train with empty input", function() {
        try {
            classifier.classifyBayes();
        } catch (e) {
            assert(e !== undefined, "didn't throw");
            assert(e.message == "Function did not receive parameter 0: classifier", "bad error message");
        }
    });
});


describe("classifiers", function() {
    it("should throw on bayes train with empty input", function() {
        try {
            classifier.classifyBayes({});
        } catch (e) {
            assert(e !== undefined, "didn't throw");
            assert(e.message == "Function did not receive parameter 1: msg", "bad error message");
        }
    });
});