$(function(){
    updateResults(students, 1);

    // Ok, setup the filters for parser.js
    $("#courses, #skills").autocomplete({
        source: function(request, response){
            response(parser(request.term));
        }
    });

});