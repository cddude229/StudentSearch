var studentsChanged = function(){
    var b = $("#email_button a");
    if(state.selectedStudents.hasItems()){
        b.removeClass("disabled").addClass("btn-primary");
    } else {
        b.addClass("disabled").removeClass("btn-primary");
    }
};

var tagsChangedFactory = function(attr){
    return function(tagSet){
        var tags = tagSet.getAllItems();
        var newStudents = objectFilter(students, attr, tags);
        updateResults(newStudents);
        // TODO: Bug - does not apply both filters at once
    };
};

var addTagFactory = function(target, valueTarget, tagSet){
    return function(e, ui){
        // Prevent default event stuff
        if(e){
            e.preventDefault();
            e.stopPropagation();
        }

        // Get value
        var tagVal = parser(valueTarget.val())[0];
        if(ui){ // If we're an autocomplete callback, use the ui.item's value instead of form value
            tagVal = ui.item.value;
        }

        // Clear old guess, hide autocomplete
        valueTarget.val("").focus().autocomplete("close");

        // Ok, now skip this if they duplicated a full tag
        if(tagSet.hasItem(tagVal)){
            // TODO: Show a temporary error and fade it out for duplicate
            return;
        }

        // Add tag
        tagSet.addItem(tagVal);
        var tag = buildTag(tagVal);
        tag.appendTo(target);
    };
};

var state = {
    selectedStudents: new Set(studentsChanged),
    hiddenStudents: new Set(),
    coursesTags: new Set(tagsChangedFactory("course_ids")),
    skillsTags: new Set(tagsChangedFactory("skills_ids")),
    currentPage: 1
};

$(function(){
    updateResults(students, 1);

    // functions used below
    var acSource = function(request, response){
        response(parser(request.term));
    };
    var coursesFactory = addTagFactory($("#courses_tags"), $("#courses"), state.coursesTags);
    var skillsFactory = addTagFactory($("#skills_tags"), $("#skills"), state.skillsTags);

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

