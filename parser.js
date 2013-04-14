/*
ALLOWED ASSUMPTIONS
1) That you don't need to suggest "6.831" if they type "6.813"
2) The they will NOT smartly separate terms, but that our key operator (commas, pluses, etc.)
   will be not in potential values.  Periods will be in potential values.
3) The words "and" and "or" can be in any capitalization, but will be nicely separated from
   potential values
*/
var andValues = ["and", "And", "AND", "+", "/", ","];
var orValues = ["or", "Or", "OR", "+", "/", ","];

var parser = function(currentString) {
  var listOfPossibilities = [];
  var terms = termsList(currentString.split(/[\s,+]+/));
  console.log("string: " + currentString + " ,terms: " + JSON.stringify(terms));
  if (terms.length == 1) {
    console.log('returning 0:' + terms[0]);
    listOfPossibilities.push(terms[0]);
    return listOfPossibilities;
  } else {
    // check if the second to last term is either an and or or, if so recurse
    var start = currentString.indexOf(terms[terms.length - 3]);
    var end = start + terms[terms.length - 3].length;
    var subOptions = parser(currentString.substring(0, end));
    console.log("else suboptions: " + JSON.stringify(subOptions));
    if (andValues.indexOf(terms[terms.length - 2]) > -1) {
      for (var i = 0; i < subOptions.length; i++) {
        if (subOptions[i].split(" ").length > 2) {
          listOfPossibilities.push("(" + subOptions[i] + ")" + " AND " + terms[terms.length - 1]);
        } else {

          listOfPossibilities.push(subOptions[i] + " AND " + terms[terms.length - 1]);
        }

      }
    }
    if (orValues.indexOf(terms[terms.length - 2]) > -1) {
      for (var g = 0; g < subOptions.length; g++) {
        if (subOptions[g].split(" ").length > 2) {
          listOfPossibilities.push("(" + subOptions[g] + ")" + " OR " + terms[terms.length - 1]);
        } else {

          listOfPossibilities.push(subOptions[g] + " OR " + terms[terms.length - 1]);
        }
      }
    }
  }
  removeParenthesis(listOfPossibilities);
  // The return needs to be a list of possible values, in good format
  return listOfPossibilities;
};

var termsList = function(termsArray) {
  for (var x = 1; x < termsArray.length; x++) {
    if (andValues.indexOf(termsArray[x]) === -1 && andValues.indexOf(termsArray[x - 1]) === -1 && orValues.indexOf(termsArray[x - 1]) === -1 && orValues.indexOf(termsArray[x]) === -1) {
      // have to add a commea between the two terms
      termsArray.splice(x, 0, ",");
      return termsList(termsArray);
    }
  }
  return termsArray;
};

var removeParenthesis = function(arr) {
  for (var x = 0; x < arr.length; x++) {
    term = arr[x];
    if (!(term.indexOf("OR") > -1 && term.indexOf("AND") > -1)) {
      // we only have one type of term so we don't need any parenthesis
      arr[x] = term.replace(/[()]/g, '')
    }
  }

}
