// Main JS code
var yearToGrade = function(year){
    // Converts a year to a grade (2013 -> senior), given a base year
    // TODO: write yearToGrade
    return year.toString();
};

var idToMajor = function(id){
    // Converts a major's ID to its name
    // TODO: write idToMajor
    return id;
};

var buildStudentCard = function(student){
    // takes a student object (See data.js) and returns a DOM object
    var holder = $("<div>").html(templates["card"]);

    // Assign data
    $(".image", holder).html("<img src='" + imagesDir + student.image + "' title='Image of Student' />");
    // TODO: Make image alt/title be something related to student's name
    $(".student_name", holder).html(student.first_name + " " + student.last_name);
    $(".year", holder).html(yearToGrade(student.class_year));
    $(".the_major", holder).html(student.major_id);
    $(".list_interests", holder).html(student.interests_list.join(", ")); // TODO: Limit this to X number of interests at a time
    // TODO: Hide interests if they don't have any

    // Add to results
    $("#results").append(holder);
};

$(function(){
    buildStudentCard(students[0]);
});