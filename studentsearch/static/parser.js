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
  var original = currentString;
  currentString = currentString.replace(/^\s+/, "").replace(/\s+$/, ""); // Fix bug that causes infinite looping on blank term
  currentString = removeAllParenthesis(currentString);
  var listOfPossibilities = [];
  var terms = termsList(currentString.split(/[\s,]+/));
  // If the enter something like "6.813 Or" just remove the last term
  if (andValues.indexOf(terms[terms.length - 1]) > -1 || orValues.indexOf(terms[terms.length - 1]) > -1) {
    terms.splice(terms.length - 1, 1);
  }
  if (andValues.indexOf(terms[0]) > -1 || orValues.indexOf(terms[0]) > -1) {
    terms.splice(0, 1);
  }
  if (terms.length <= 1) {
    listOfPossibilities.push(terms[0]);
    return listOfPossibilities;
  } else {
    // check if the second to last term is either an and or or, if so recurse
    var numTerms = Math.ceil(terms.length / 2.0) - 1;
    for (var p = 0; p < numTerms; p++) {
      var seperatorTerm = terms[terms.length - 2 - 2 * p];
      var string1 = "";
      for (var s = 0; s <= terms.length - 3 - 2 * p; s++) {
        string1 += terms[s] + " ";
      }
      var string2 = "";
      for (var s2 = terms.length - 1 - 2 * p; s2 < terms.length; s2++) {
        string2 += terms[s2] + " ";
      }
      string2 = string2.substring(0, string2.length - 1);
      string1 = string1.substring(0, string1.length - 1);
      var subOptions = parser(string1);
      var subOptions2 = parser(string2);
      for (var a = 0; a < subOptions2.length; a++) {
        for (var i = 0; i < subOptions.length; i++) {
          var term1 = subOptions[i];
          var term2 = subOptions2[a];
          if (subOptions[i].split(" ").length > 2) {
            term1 = "(" + subOptions[i] + ")";
          }
          if (subOptions2[a].split(" ").length > 2) {
            term2 = "(" + subOptions2[a] + ")";
          }
          if (andValues.indexOf(terms[terms.length - 2 - 2 * p]) > -1) {
            listOfPossibilities.push(term1 + " AND " + term2);

          }
          if (orValues.indexOf(terms[terms.length - 2 - 2 * p]) > -1) {
            listOfPossibilities.push(term1 + " OR " + term2);

          }
        }
      }
    }
  }
  removeParenthesis(listOfPossibilities);
  listOfPossibilities.sort(function(a, b) {
    if (b === original) {
      return 1;
    } else if (a === original) {
      return -1;
    } else {
      return 0;
    }
  });
  // The return needs to be a list of possible values, in good format
  return lessTerms(listOfPossibilities.filter(function(elem, pos) {
    return listOfPossibilities.indexOf(elem) == pos;
  }));
};

var termsList = function(termsArray) {
  for (var x = 1; x < termsArray.length; x++) {
    if (andValues.indexOf(termsArray[x]) === -1 && andValues.indexOf(termsArray[x - 1]) === -1 && orValues.indexOf(termsArray[x - 1]) === -1 && orValues.indexOf(termsArray[x]) === -1) {
      // have to add a commea between the two terms
      termsArray.splice(x, 0, ",");
      //   return termsList(termsArray);
    }
  }
  for (var y = 1; y < termsArray.length; y++) {

    if ((andValues.indexOf(termsArray[y]) > -1 || orValues.indexOf(termsArray[y]) > -1) && (andValues.indexOf(termsArray[y - 1]) > -1 || orValues.indexOf(termsArray[y - 1]) > -1)) {
      // have to add a commea between the two terms
      termsArray.splice(y + 1, 1);
      // return termsList(termsArray);
    }
  }
  if (andValues.indexOf(termsArray[termsArray.lengh - 1]) > -1 || andValues.indexOf(termsArray[termsArray.lengh - 1]) > -1) {

  }
  return termsArray;
};

removeAllParenthesis = function(string) {
  var remove = [];
  for (var x = 0; x < string.length; x++) {
    if (string[x] === "(" || string[x] === ")") {
      remove.push(x);
    }
  }
  for (var i = remove.length - 1; i > 0; i--) {
    string = string.substring(0, remove[i]) + string.substring(remove[i] + 1, string.length);
  }
  return string;

};
var lessTerms = function(suggestions) {
  return suggestions;
  var sorted = _.sortBy(suggestions, function(str) {
    return str.split("(").length;
  });
  if (sorted.length < 16) {
    return sorted;
  } else {
    return sorted.slice(0, 16);
  }

}
var removeParenthesis = function(arr) {
  for (var x = 0; x < arr.length; x++) {
    term = arr[x];
    if (!(term.indexOf("OR") > -1 && term.indexOf("AND") > -1)) {
      // we only have one type of term so we don't need any parenthesis
      term = term.replace(/[()]/g, '')
    }
    arr[x] = term;
  }

}
