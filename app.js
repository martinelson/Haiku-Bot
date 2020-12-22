const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const words = require(__dirname + "/wordsapi_sample.json");
var lineOne = "";
var lineTwo = "";
var lineThree = "";

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
  //setting up line variables
  var lineOne = "";
  var lineTwo = "";
  var lineThree = "";
  let lineOneSummary = [];
  let lineTwoSummary = [];
  let lineThreeSummary = [];
  let complete = false;
  let lineOneCount = 0;
  let lineTwoCount = 0;
  let lineThreeCount = 0;

  //syllable loop
  while (complete === false) {
    //checking if words have syllables or definitions, generating random number
    let wordList = Object.keys(words);
    let rand_key = wordList[Math.floor(Math.random()*wordList.length)];
    let hasSyllables = words[rand_key].hasOwnProperty('syllables');
    let hasDefinition = words[rand_key].hasOwnProperty('definitions');
    //if definitions exists, check if there is an actual definition
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
    //if there is a syllable or has a definition:
    if (hasSyllables && hasDefinitions) {
      //generate random word
      let selectedWord = rand_key
      //count the syllables
      let syllableCount = words[rand_key].syllables.count
      //check if there are less than or equal to 5 syllables in the cumulative syllable count for line 1
      if (syllableCount + lineOneCount <= 5){
        //adding word, definition and sylllable count object to line one list
        lineOneSummary.push({word: _.capitalize(rand_key),
          def: words[rand_key].definitions[0].definition,
          syllables: words[rand_key].syllables.count})
        lineOne += _.capitalize(rand_key) + " "
        lineOneCount += syllableCount
        //check if there are less than or equal to 7 syllables in the cumulative syllable count for line 2
      } else if(syllableCount + lineTwoCount <= 7){
        //adding word, definition and sylllable count object to line one list
        lineTwoSummary.push({word: _.capitalize(rand_key),
          def: words[rand_key].definitions[0].definition,
          syllables: words[rand_key].syllables.count})
        lineTwo += _.capitalize(rand_key) + " "
        lineTwoCount += syllableCount
        //check if there are less than or equal to 5 syllables in the cumulative syllable count for line 3
      } else if(syllableCount + lineThreeCount <= 5){
        //adding word, definition and sylllable count object to line one list
        lineThreeSummary.push({word: _.capitalize(rand_key),
          def: words[rand_key].definitions[0].definition,
          syllables: words[rand_key].syllables.count})
        lineThree += _.capitalize(rand_key) + " "
        lineThreeCount += syllableCount
      }
    }
    //if the haiku is complete, end the looping
    if (lineOneCount === 5 & lineTwoCount === 7 & lineThreeCount === 5){
      complete = true
    }
  }
//render out haiku
  res.render(__dirname+"/views/index", {
    lineOne: lineOne,
    lineOneSummary: lineOneSummary,
    lineTwo: lineTwo,
    lineTwoSummary: lineTwoSummary,
    lineThree: lineThree,
    lineThreeSummary: lineThreeSummary
  });

});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
