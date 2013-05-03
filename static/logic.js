var drawEverything = function(){
    state.coursesTagGrouping.clean();
    state.skillsTagGrouping.clean();

    rerenderTags();
    filtersChanged();
    hiddenStudentsList();
    updateButtons();
};

var updateButtons = function(){
    // Handle selected student-dependent buttons
    var b = $("#email_button a");
    var b3 = $("#send_email .no_students");
    if(state.selectedStudents.hasItems()){
        var c = state.selectedStudents.countItems();
        b.html("E-mail " + c + " Student" + (c == 1?"":"s"));
        b.removeClass("disabled").addClass("btn-primary");
        b3.hide();
    } else {
        b.html("E-mail Students");
        b.addClass("disabled").removeClass("btn-primary");
        b3.show();
    }

    // Send e-mail button
    var b4 = $("#send_email_button");
    if(state.selectedStudents.hasItems() && state.currentTitle.length > 0 && state.currentMessage.length > 0){
        b4.removeClass("disabled").addClass("btn-primary");
    } else {
        b4.addClass("disabled").removeClass("btn-primary");
    }

    // Hidden students button
    var b2 = $("#hidden_students_btn");
    if(state.hiddenStudents.hasItems()){
        b2.removeClass("disabled").addClass("btn-primary");
        var c = state.hiddenStudents.countItems();
        b2.html("View " + c + " Hidden Student" + (c == 1?"":"s"));
    } else {
        b2.addClass("disabled").removeClass("btn-primary");
        b2.html("View Hidden Students");
    }

    // State dependent button
    var b4 = $("#start_new_search_btn");
    if(state.hasStarted()){
        b4.removeClass("disabled").addClass("btn-primary");
        window.onbeforeunload = function(){
            return 'Leaving now will delete your search.';
        };
    } else {
        b4.addClass("disabled").removeClass("btn-primary");
        window.onbeforeunload = function(){};
    }
};

var filtersChanged = function(){
    // Update search results

    var newStudents = [];
    var shownYears = [];
    for(var a=0;a<yearsToShow.length;a++){
        if(state.yearsHidden.hasItem(yearsToShow[a]) == false){
            shownYears.push(yearsToShow[a]);
        }
    }

    // Call the backend
    $.ajax({
        method: "post",
        dataType: "json",
        url: "/search",
        data: {
            hidden_ids: state.hiddenStudents.getAllItems().join(","),
            show_emailed: true, // TODO
            shown_years: shownYears.join(","),
            coursesString: state.coursesTagGrouping.toString(),
            skillsString: state.skillsTagGrouping.toString(),
            sortOrder: state.searchOrder
        },
        async: false,
        success: function(data){
            newStudents = data.results;
        }

    });

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

var rerenderTags = function(){
    var addIndividual = function(target, tagVal, theGroup, parent){
        var delCallback = function(){
            theGroup.removeItem(tagVal);
            drawEverything();
        };

        var tag = buildTag(tagVal, delCallback).appendTo(target);
        tag.data("theGroup", theGroup);
        tag.data("tagVal", tagVal);

        tag.draggable({
            containment: parent,
            revert: true,
            helper: "clone",
            opacity: 0.7
        });

        tag.droppable({
            accept: ".tag",
            greedy: true,
            drop: function(event, ui){
                stopEvents(event);
                var dropped = ui.draggable;
                var newVal = dropped.data("tagVal");
                dropped.data("theGroup").removeItem(newVal);
                if(theGroup.type == "OR"){
                    theGroup.addItem(newVal);
                } else {
                    var newGrouping = grouping("OR", [tagVal, newVal]);
                    theGroup.replaceItem(tagVal, newGrouping);
                }
                drawEverything();
            }
        });
    };

    var addTag = function(target, theGroup, parent){
        if(theGroup.type == "OR"){
            var orTag = $("<fieldset>").addClass("or_tag");
            orTag.append($("<legend>").html("OR"));
            orTag.droppable({
                accept: ".tag",
                greedy: true,
                drop: function(event, ui){
                    stopEvents(event);
                    var dropped = ui.draggable;
                    var newVal = dropped.data("tagVal");
                    dropped.data("theGroup").removeItem(newVal);
                    theGroup.addItem(newVal);
                    drawEverything();
                }
            });
            orTag.appendTo(target);
            target = orTag;
        }

        for(var a=0;a<theGroup.items.length;a++){
            if(typeof theGroup.items[a] == "string"){
                addIndividual(target, theGroup.items[a], theGroup, parent);
            } else {
                addTag(target, theGroup.items[a], parent);
            }
        }
    };

    var tagSets = [
        ["#courses_form", state.coursesTagGrouping],
        ["#skills_form", state.skillsTagGrouping]
    ];

    for(var a=0;a<tagSets.length;a++){
        var target = tagSets[a][0];
        var theGroup = tagSets[a][1];

        $(".tag, .or_tag", target).remove();
        addTag($(target), theGroup, target);
    }
};

var addTagFactory = function(valueTarget, getGroupingFunc){
    return function(e, ui){
        // Prevent default event stuff
        stopEvents(e);

        // Get value
        var tagVal = valueTarget.val();
        if(ui){ // If we're an autocomplete callback, use the ui.item's value instead of form value
            tagVal = ui.item.value;
        }

        tagVals = parser(tagVal);

        // Handle completion
        var completeFunc = function(tagVal){
            // Clear old guess, hide autocomplete
            valueTarget.val("").focus().autocomplete("close");

            // Alright, so at this point I want to add everything.
            // First, pass to terminator
            var grouping = terminator(tagVal);

            // Now, add to grouping, then redraw everything
            getGroupingFunc().addItem(grouping);
            drawEverything();
        };

        // Should we ask them what they meant?
        if(tagVals.length == 1){
            completeFunc(tagVals[0]);
        } else {
            showPickTag(tagVal, tagVals, completeFunc);
        }
    };
};

var startNewSearch = function(){
    if(state.hasStarted()){
        // Reset state
        state.selectedStudents.clear();
        state.hiddenStudents.clear();
        state.coursesTagGrouping = grouping("AND", []);
        state.skillsTagGrouping = grouping("AND", []);
        state.yearsHidden.clear();
        state.searchOrder = "alphabetical";
        state.currentPage = 1;

        state.currentTitle = "";
        state.currentMessage = "";

        // Clear listed tags
        $(".tag_holder .tag").remove();

        // Clear fields
        $("#courses, #skills").val("").autocomplete("close");

        // Clear the shown alerts
        $("#alert_holder .alert").remove();

        // Reset options
        $(".2016_check, .2015_check, .2014_check, .2013_check").each(function(){
            this.checked = true;
        });

        // Redraw everything
        drawEverything();
    }
}

var state = {
    selectedStudents: new Set(drawEverything),
    hiddenStudents: new Set(drawEverything),
    coursesTagGrouping: grouping("AND", []),
    skillsTagGrouping: grouping("AND", []),
    yearsHidden: new Set(drawEverything),
    searchOrder: "alphabetical",
    currentPage: 1,
    currentTitle: "",
    currentMessage: "",
    hasStarted: function(){
        return (this.selectedStudents.hasItems()
            || this.hiddenStudents.hasItems()
            || this.coursesTagGrouping.items.length > 0
            || this.skillsTagGrouping.items.length > 0
            || this.currentTitle.length > 0
            || this.currentMessage.length > 0
            || $("#alert_holder .alert").length > 0
            || this.yearsHidden.length > 0
            || this.searchOrder != "alphabetical"
        );
    }
};

startNewSearch();

$(function(){
    filtersChanged();

    // functions used below
    var acSource = function(request, response){
        response(parser(request.term));
    };
    var coursesFactory = addTagFactory($("#courses"), function(){
        return state.coursesTagGrouping;
    });
    var skillsFactory = addTagFactory($("#skills"), function(){
        return state.skillsTagGrouping;
    });


    var addDropZone = function(target, theGroup){
        $(target).droppable({
            accept: ".tag",
            greedy: true,
            drop: function(event, ui){
                stopEvents(event);
                var dropped = ui.draggable;
                var newVal = dropped.data("tagVal");
                dropped.data("theGroup").removeItem(newVal);
                theGroup.addItem(newVal);
                drawEverything();
            }
        });
    };

    addDropZone($("#courses_form"), state.coursesTagGrouping);
    addDropZone($("#skills_form"), state.skillsTagGrouping);

    // Autocomplete helper/generation function
    var andOrParse = function(list){
        return function(request, callback){
            var terms = termsList(request.term.split(/[\s,]+/));
            var lastTerm = terms[terms.length-1];
            var lastTermNoParen = lastTerm.replace(/[\(\)]/g, "");

            // Drop and/or terms
            var lastTermLower = lastTerm.toLowerCase();
            if(lastTermNoParen == "" || lastTermLower == "and" || lastTermLower == "or"){
                return callback([]);
            }

            // Use the default filter
            var returnedItems = $.ui.autocomplete.filter(list, lastTermNoParen);
            var lastTermRegExp = new RegExp($.ui.autocomplete.escapeRegex(lastTermNoParen) + "(\\\))?$", "");
            returnedItems = _.map(returnedItems, function(item){
                return { label: item, value: request.term.replace(lastTermRegExp, item + "$1") };
            });
            callback(returnedItems);
        };
    };

    // Setup courses autocomplete
    var courseList = [];
    for(var a=0;a<courses.length;a++){
        courseList = courseList.concat(courses[a].list_of_numbers);
    }
    $("#courses").autocomplete({
        source: andOrParse(courseList)
    }).on("autocompleteselect", coursesFactory);
    $("#courses_form").submit(coursesFactory);

    // Setup skills autocomplete
    var skillsList = [];
    for(var a in skills){
        skillsList.push(skills[a].name);
    }
    $("#skills").autocomplete({
        source: andOrParse(skillsList)
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
            }, null, clearSearchTitle, clearSearchMessage, clearSearchYes, clearSearchNo);
        }
    });

    // Handle closing dialogs
    $(document).on("click", "#surround .close_x", closeSurround);

    // Handle the options stuff
    $(".2016_check, .2015_check, .2014_check, .2013_check").change(function(){
        var year = this.className.match(/(\d+)/) ? RegExp.$1 - 0 : 0;
        if(this.checked){
            state.yearsHidden.removeItem(year);
        } else {
            state.yearsHidden.addItem(year);
        }
    });
        //var val = $('input[name=sexyBitch]:checked', this).val();
});

