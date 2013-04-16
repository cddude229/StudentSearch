var studentsChanged = function(){
    var b = $("#email_button a");
    if(state.selectedStudents.hasItems()){
        b.removeClass("disabled").addClass("btn-primary");
    } else {
        b.addClass("disabled").removeClass("btn-primary");
    }
};

var addTagFactory = function(target, valueTarget){
    return function(e, ui){
        // Prevent default event stuff
        if(e){
            e.preventDefault();
            e.stopPropagation();
        }

        // Handle guess
        var tagVal = parser(valueTarget.val())[0];
        if(ui){ // If we're an autocomplete callback, use the ui.item's value instead of form value
            tagVal = ui.item.value;
        }
        var tag = buildTag(tagVal);
        tag.appendTo(target);

        // Clear old guess, hide autocomplete
        valueTarget.val("").focus().autocomplete("close");
    };
};

var state = {
    selectedStudents: new Set(studentsChanged)
};

$(function(){
    updateResults(students, 1);

    // functions used below
    var acSource = function(request, response){
        response(parser(request.term));
    };
    var coursesFactory = addTagFactory($("#courses_tags"), $("#courses"));
    var skillsFactory = addTagFactory($("#skills_tags"), $("#skills"));

    // Setup courses autocomplete
    $("#courses").autocomplete({
        source: acSource
    }).on("autocompleteselect", coursesFactory);
    $("#courses_form").submit(coursesFactory);

    // Setup skills autocomplete
    $("#skills").autocomplete({
        source: acSource
    }).on("autocompleteselect", skillsFactory);
    $("#skills_form").submit(skillsFactory);
});

