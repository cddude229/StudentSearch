var testResult = function(query, answer, message){
    var res = terminator(query);
    deepEqual(res, answer, message);
};

test("no parenthesis", function(){

    testResult("a AND b", grouping("AND", ["a", "b"]), "basic AND");
    testResult("a OR b", grouping("OR", ["a", "b"]), "basic OR");

    testResult("a AND b AND c", grouping("AND", ["a", "b", "c"]), "double AND");
    testResult("a OR b OR c", grouping("OR", ["a", "b", "c"]), "double OR");
});


test("simple w/ parenthesis", function(){

    testResult("a AND (b OR c)", grouping("AND", ["a", grouping("OR", ["b", "c"])]), "basic AND then OR");
    testResult("a OR (b AND c)", grouping("OR", ["a", grouping("AND", ["b", "c"])]), "basic OR then AND");
});
