// Main functions for use
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

var updateResults = function(students, page){
    // Setup new search results; clears current page
    page = page || 1; // Default to page one

    // Clear current pagination
    $("#search_pagination .page").remove();

    // Build new pagination
    // Figure out max page and adjust page
    var maxPage = Math.ceil(students.length / studentsPerPage); // TODO: Calculate max page
    page = Math.min(page, maxPage); // Limit to the max page

    // Add elements
    for(var a=1;a<=maxPage;a++){
        var ele = $("<li>").addClass("page page-"+a);
        var an = $("<a href='#'>").html(a).appendTo(ele);
        //if(a == page) ele.addClass("active"); // Added later by call to changePage()

        var func = (function(currentA){
            return function(){
                changePage(students, currentA);
            };
        })(a);

        ele.click(func);
        $("#search_pagination ul").append(ele);
    }

    // Build student list
    changePage(students, page);

};

var changePage = function(students, page){
    // Changes the page of results
    // Assumes page is valid
    $("#results .student_card").remove();

    // Show students
    var start = studentsPerPage * (page - 1);
    var end = start + studentsPerPage;
    end = Math.min(end, students.length)
    for(var a=start;a<end;a++){
        buildStudentCard(students[a]);
    }

    // Change page marker
    $("#search_pagination .page.active").removeClass("active");
    $("#search_pagination .page-"+page).addClass("active");
};