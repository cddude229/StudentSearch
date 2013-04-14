test("single item filter - single object", function(){
    var theObjects = [
        { testing: ["6.813", "6.831", "18.440"]}
    ];
    var theAttribute = "testing";

    deepEqual(objectFilter(theObjects, theAttribute, "6.813"), theObjects, "Make sure it can find them at any index");
    deepEqual(objectFilter(theObjects, theAttribute, "6.831"), theObjects, "Make sure it can find them at any index");
    deepEqual(objectFilter(theObjects, theAttribute, "18.440"), theObjects, "Make sure it can find them at any index");
});

test("single item filter - multiple objects", function(){
    var theObjects = [
        { testing: ["6.813", "6.831", "18.440"]},
        { testing: ["6.813", "6.831", "18.440"]},
        { testing: ["6.813", "6.831", "18.440"]},
        { testing: ["6.813", "6.831", "18.440"]}
    ];
    var theAttribute = "testing";

    deepEqual(objectFilter(theObjects, theAttribute, "6.813"), theObjects, "Make sure it can find them at any index");
    deepEqual(objectFilter(theObjects, theAttribute, "6.831"), theObjects, "Make sure it can find them at any index");
    deepEqual(objectFilter(theObjects, theAttribute, "18.440"), theObjects, "Make sure it can find them at any index");
});


test("simple AND filter - multiple objects", function(){
    var theObjects = [
        { testing: ["6.813", "6.831", "18.440"]},
        { testing: ["6.813", "6.831", "18.440"]},
        { testing: ["6.813", "6.831", "18.440"]},
        { testing: ["6.813", "6.831", "18.440"]}
    ];
    var theAttribute = "testing";

    deepEqual(objectFilter(theObjects, theAttribute, "6.813 AND 6.831"), theObjects, "Make sure that it handles a basic AND");
    deepEqual(objectFilter(theObjects, theAttribute, "(6.831 AND 18.440)"), theObjects, "Make sure it can handles an AND and parenthesis");
});