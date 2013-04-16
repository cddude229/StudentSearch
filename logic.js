var studentsChanged = function(){
    var b = $("#email_button a");
    if(state.selectedStudents.hasItems()){
        b.removeClass("disabled").addClass("btn-primary");
    } else {
        b.addClass("disabled").removeClass("btn-primary");
    }

    var b2 = $("#hidden_students_btn");
    if(state.hiddenStudents.hasItems()){
        b2.removeClass("disabled").addClass("btn-primary");
    } else {
        b2.addClass("disabled").removeClass("btn-primary");
    }
};

var filtersChanged = function(){
    // Update search results

    var newStudents = [];

    // take out hidden students
    for(var a=0;a<students.length;a++){
        if(state.hiddenStudents.hasItem(students[a].id) == false){
            newStudents.push(students[a]);
        }
    }

    // filter for skills, courses
    newStudents = objectFilter(newStudents, "skills_ids", state.skillsTags.getAllItems());
    newStudents = objectFilter(newStudents, "courses_ids", state.coursesTags.getAllItems());

    // Update the UI
    updateResults(newStudents);
    studentsChanged();

    // TODO: Bug - does not remove students from selected list if they don't match the filter
};

var addTagFactory = function(target, valueTarget, tagSet){
    return function(e, ui){
        // Prevent default event stuff
        stopEvents(e);

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
    hiddenStudents: new Set(filtersChanged),
    coursesTags: new Set(filtersChanged),
    skillsTags: new Set(filtersChanged),
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

    // Setup e-mail button
    $("#email_button a").click(function(e){
        stopEvents(e);
        if(state.selectedStudents.countItems() > 0){
            showEmailForm();
        }
    });
});

