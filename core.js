// Main JS code

var studentTemplate;
$.ajax({
    url: "./student_card.html",
    success: function(data){
        alert("hi");
        studentTemplate = data;
    },
    async: false
});
alert(studentTemplate);
var buildStudentCard = function(student){
    // takes a student object (See data.js) and returns a DOM object
    $.get('student_card.html', function(data){
        var holder = $("<div>").html(data);

    });
}