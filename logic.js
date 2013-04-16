var state = {
    selectedStudents: [],
    selectStudent: function(studentId){
        if(this.isSelected(studentId)) return;

        this.selectedStudents.push(studentId);

        studentsChanged();
    },
    deselectStudent: function(studentId){
        if(!this.isSelected(studentId)) return;
        var idx = this.selectedStudents.indexOf(studentId);
        this.selectedStudents.splice(idx, 1);

        studentsChanged();
    },
    isSelected: function(studentId){
        return this.selectedStudents.indexOf(studentId) > -1;
    },
    hasStudents: function(){
        return this.selectedStudents.length > 0;
    }
};

var studentsChanged = function(){
    var b = $("#email_button a");
    if(state.hasStudents()){
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
        var tagVal = valueTarget.val();
        if(ui){ // If we're an autocomplete callback, use the ui.item's value instead of form value
            tagVal = ui.item.value;
        }
        var tag = buildTag(tagVal);

        // Clear old guess
        valueTarget.val("");
    };
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