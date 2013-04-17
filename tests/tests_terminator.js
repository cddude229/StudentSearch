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
    testResult("a AND (b OR c)", grouping("AND", ["a", grouping("OR", ["b", "c"])]), "basic AND then grouped-OR");
    testResult("a OR (b AND c)", grouping("OR", ["a", grouping("AND", ["b", "c"])]), "basic OR then grouped-AND");

    testResult("(a AND b) OR c",grouping("OR", [grouping("AND", ["a", "b"]), "c"]), "basic grouped-AND then OR");
    testResult("(a OR b) AND c", grouping("AND", [grouping("OR", ["a", "b"]), "c"]), "basic grouped-OR then AND");
});


test("paren-ception (we must go deeper)", function(){
    testResult("a AND (b OR (c AND (d OR e)))",
        grouping("AND", ["a",
            grouping("OR", ["b",
                grouping("AND", ["c", 
                    grouping("OR", ["d", "e"])
                ])
            ])
        ])
    , "3-deep parenthesis.");

})