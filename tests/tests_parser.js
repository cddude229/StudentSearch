test("convert commas", function(){
    var testResult = function(query, answer, message){
        var res = parser(query);
        // Need to make sure they're sorted the same
        res.sort();
        answer.sort();
        deepEqual(res, answer, message);
    };

    testResult("a, b", ["a AND b", "a OR b"], "Basic comma test");
    testResult("a, b, c", ["a AND b AND c", "a OR b OR c", "(a AND b) OR c", "(a OR b) AND c"], "complicated comma test");
    testResult("a, b, or c", ["(a AND b) OR c", "a OR b OR c"], "Or-comma test");
    testResult("a, b, and c", ["a AND b AND c"], "And-comma test");
});

test("convert plus", function(){
    var testResult = function(query, answer, message){
        var res = parser(query);
        // Need to make sure they're sorted the same
        res.sort();
        answer.sort();
        deepEqual(res, answer, message);
    };

    testResult("a + b", ["a AND b", "a OR b"], "Basic plus test");
    testResult("a + b or c", ["(a AND b) OR c", "a OR b OR c"], "Or-plus test");
    testResult("a + b and c", ["a AND b AND c"], "And-plus test");
});

test("convert and/or", function(){
    var testResult = function(query, answer, message){
        var res = parser(query);
        // Need to make sure they're sorted the same
        res.sort();
        answer.sort();
        deepEqual(res, answer, message);
    };

    testResult("a and b", ["a AND b"], "Basic and test");
    testResult("a or b", ["a OR b"], "Basic or test");
    testResult("a and b or c", ["(a AND b) OR c", "a AND (b OR c)"], "Or-composite test");
    testResult("a and b or c or  d", [
      "((a AND b) OR c) OR d",
        "(a AND (b OR c)) OR d",
          "(a AND b) OR (c OR d)",
            "a AND (b OR c OR d)"
            ], "complicated or-composite test");
});
