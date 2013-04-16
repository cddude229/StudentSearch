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
}

$(function(){
    updateResults(students, 1);

    // Ok, setup the filters for parser.js
    $("#courses, #skills").autocomplete({
        source: function(request, response){
            response(parser(request.term));
        }
    });

});