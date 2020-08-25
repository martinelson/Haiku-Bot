const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const words = require(__dirname + "/wordsapi_sample.json");
var lineOne = ""
var lineTwo = ""
var lineThree = ""

//create express app//
const app = express();

//set view engine to ejs//
app.set('view engine', 'ejs');

//using bodyparser and static public files//
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//getting index//
app.get("/", function(req, res) {
  res.render(__dirname + "/views/index", {
  lineOne: lineOne}
)
});

//posting haiku after button click//
app.post("/", function(req, res){
  var lineOne = ""
  var lineTwo = ""
  var lineThree = ""
  let lineOneSummary = []
  let lineTwoSummary = []
  let lineThreeSummary = []
  let complete = false;
  let lineOneCount = 0
  let lineTwoCount = 0
  let lineThreeCount = 0

  while (complete === false) {
    let wordList = Object.keys(words);
    let rand_key = wordList[Math.floor(Math.random()*wordList.length)];
    let hasSyllables = words[rand_key].hasOwnProperty('syllables');
    let hasDefinition = words[rand_key].hasOwnProperty('definitions');
    if (hasDefinition) {
      try{
        var hasDefinitions = words[rand_key].definitions[0].hasOwnProperty('definition');
      }
      catch(err){
        var hasDefinitions = false;
      }
    } else{
      var hasDefinitions = false;
    }
    if (hasSyllables && hasDefinitions) {
      let selectedWord = rand_key
      let syllableCount = words[rand_key].syllables.count
      if (syllableCount + lineOneCount <= 5){
        lineOneSummary.push({word: _.capitalize(rand_key),
          def: words[rand_key].definitions[0].definition,
          syllables: words[rand_key].syllables.count})
        // console.log("lineone before " + lineOneCount)
        // console.log(rand_key, syllableCount)
        lineOne += _.capitalize(rand_key) + " "
        lineOneCount += syllableCount
        // console.log("lineone after " + lineOneCount)
      } else if(syllableCount + lineTwoCount <= 7){
        lineTwoSummary.push({word: _.capitalize(rand_key),
          def: words[rand_key].definitions[0].definition,
          syllables: words[rand_key].syllables.count})
        // console.log("linetwo before " + lineTwoCount)
        // console.log(rand_key, syllableCount)
        lineTwo += _.capitalize(rand_key) + " "
        lineTwoCount += syllableCount
        // console.log("linetwo after " + lineTwoCount)
      } else if(syllableCount + lineThreeCount <= 5){
        lineThreeSummary.push({word: _.capitalize(rand_key),
          def: words[rand_key].definitions[0].definition,
          syllables: words[rand_key].syllables.count})
        // console.log("linethree before " + lineThreeCount)
        // console.log(rand_key, syllableCount)
        lineThree += _.capitalize(rand_key) + " "
        lineThreeCount += syllableCount
        // console.log("linethree after " + lineThreeCount)
      }
    }
    if (lineOneCount === 5 & lineTwoCount === 7 & lineThreeCount === 5){
      complete = true
    }
  }
  // console.log("lineone " + lineOne)
  // console.log("linetwo " + lineTwo)
  // console.log("linethree " + lineThree)
  res.render(__dirname+"/views/index", {
    lineOne: lineOne,
    lineOneSummary: lineOneSummary,
    lineTwo: lineTwo,
    lineTwoSummary: lineTwoSummary,
    lineThree: lineThree,
    lineThreeSummary: lineThreeSummary
  });

});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
