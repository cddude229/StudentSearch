var drawEverything = function(){
    filtersChanged();
    hiddenStudentsList();
    updateButtons();
};

var updateButtons = function(){
    // Handle selected student-dependent buttons
    var b = $("#email_button a, #send_email_button");
    var b3 = $("#send_email .no_students");
    if(state.selectedStudents.hasItems()){
        b.removeClass("disabled").addClass("btn-primary");
        b3.hide();
    } else {
        b.addClass("disabled").removeClass("btn-primary");
        b3.show();
    }

    // Hidden students button
    var b2 = $("#hidden_students_btn");
    if(state.hiddenStudents.hasItems()){
        b2.removeClass("disabled").addClass("btn-primary");
    } else {
        b2.addClass("disabled").removeClass("btn-primary");
    }

    // State dependent button
    var b4 = $("#start_new_search_btn");
    if(state.hasStarted()){
        b4.removeClass("disabled").addClass("btn-primary");
    } else {
        b4.addClass("disabled").removeClass("btn-primary");
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
};

var addTagFactory = function(target, valueTarget, tagSet){
    var addIndividual = function(target, tagVal){
        var tag;
        var delCallback = function(){
            tag.remove();
        };
        tag = buildTag(tagVal, delCallback);
        tag.appendTo(target);
    };
    var addTag = function(target, grouping){
        if(grouping.type == "OR"){
            var orTag = $("<fieldset>").addClass("or_tag");
            orTag.append($("<legend>").html("OR"));
            orTag.appendTo(target);
            target = orTag;
        }

        for(var a=0;a<grouping.items.length;a++){
            if(typeof grouping.items[a] == "string"){
                addIndividual(target, grouping.items[a])
            } else {
                addTag(target, grouping.items[a]);
            }
        }
    };
    return function(e, ui){
        // Prevent default event stuff
        stopEvents(e);

        // TODO: Need to support drag and drop together

        // Get value
        var tagVal = parser(valueTarget.val())[0];
        if(ui){ // If we're an autocomplete callback, use the ui.item's value instead of form value
            tagVal = ui.item.value;
        }

        // Clear old guess, hide autocomplete
        valueTarget.val("").focus().autocomplete("close");

        // Alright, so at this point I want to add everything.
        // First, pass to terminator
        var grouping = terminator(tagVal);

        // Now, at this point we want to recursively add things by going through the groupings.
        addTag(target, grouping);

        // TODO: Re-implement not allowing duplicate tags
    };
};

var startNewSearch = function(){
    if(state.hasStarted()){
        // Reset state
        state.selectedStudents.clear();
        state.hiddenStudents.clear();
        state.coursesTags.clear();
        state.skillsTags.clear();
        state.currentPage = 1;

        // Clear listed tags
        $(".tag_holder .tag").remove();

        // Clear fields
        $("#courses, #skills").val("").autocomplete("close");

        // Redraw everything
        drawEverything();
    }
}

var state = {
    selectedStudents: new Set(drawEverything),
    hiddenStudents: new Set(drawEverything),
    coursesTags: new Set(drawEverything),
    skillsTags: new Set(drawEverything),
    currentPage: 1,
    currentTitle: "",
    currentMessage: "",
    hasStarted: function(){
        return (this.selectedStudents.hasItems()
            || this.hiddenStudents.hasItems()
            || this.coursesTags.hasItems()
            || this.skillsTags.hasItems()
            || this.currentTitle.length > 0
            || this.currentMessage.length > 0
        );
    }
};

startNewSearch();

// TODO: Confirm leaving page after entering information
// TODO: Make "new search" button only activate if neceesary

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
        if(state.hasStarted()){
            showConfirm(function(e){
                stopEvents(e);
                startNewSearch();
                closeSurround();
            });
        }
    });
});

