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

    // Ok, now remove them from the selected list
    var stillHave = new Set();
    for(var a=0;a<newStudents.length;a++){
        var studentId = newStudents[a].id;
        if(state.selectedStudents.hasItem(studentId)){
            stillHave.addItem(studentId);
        }
    }

    var idSet = state.selectedStudents.getAllItems();
    for(var a=0;a<idSet.length;a++){
        if(stillHave.hasItem(idSet[a]) == false){
            state.selectedStudents.removeItem(idSet[a]);
        }
    }

    // Update the UI
    updateResults(newStudents);
    studentsChanged();
    hiddenStudentsList();
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

        // tag deletion callback
        var tag;
        var delCallback = function(){
            tagSet.removeItem(tagVal);
            tag.remove();
        };

        // Add tag
        tagSet.addItem(tagVal);
        tag = buildTag(tagVal, delCallback);
        tag.appendTo(target);
    };
};

var startNewSearch = function(){
        // Reset state
        state.selectedStudents.clear();
        state.hiddenStudents.clear();
        state.coursesTags.clear();
        state.skillsTags.clear();
        state.currentPage = 1;

        // Clear listed tags
        $(".tag_holder .tag").remove();
}

var state = {
    selectedStudents: new Set(studentsChanged),
    hiddenStudents: new Set(filtersChanged),
    coursesTags: new Set(filtersChanged),
    skillsTags: new Set(filtersChanged),
    currentPage: 1,
    currentTitle: "",
    currentMessage: ""
};

startNewSearch();

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

    // Setup hidden students button
    $("#hidden_students_btn").click(function(e){
        stopEvents(e);
        if(state.hiddenStudents.countItems() > 0){
            showHiddenStudents();
        }
    });

    // Setup new search button
    $("#start_new_search_btn").click(function(e){
        stopEvents(e);
        startNewSearch();
        // TODO: This needs to show the confirmation window
    });
});

