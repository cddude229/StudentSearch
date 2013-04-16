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
    var holder = $("<div>").html(templates["card"]).addClass("student_card_surround");

    // Assign data
    var studentName = student.first_name + " " + student.last_name;
    $(".student_name", holder).html(studentName);
    $(".year", holder).html(yearToGrade(student.class_year));
    $(".the_major", holder).html(student.major_id);

    // Do interests
    if(student.interests_list.length == 0){
        $(".interests").hide();
    } else {
        var interests = student.interests_list;

        // Limit interests to interestsCardLimit variable
        if(interests.length > interestsCardLimit){
            interests = interests.slice(0, interestsCardLimit);
            interests.push("and others...");
        }

        // Show interests
        $(".list_interests", holder).html(interests.join(", "));
    }

    // Do image
    var titleStr = "Image of " + studentName;
    // Use studentName of first_name because first names are common
    $("<img>")
        .attr("src", imagesDir + student.image)
        .attr("title", titleStr)
        .attr("alt", titleStr)
        .appendTo($(".image", holder));

    return holder;
};

var updateResults = function(students, page){
    // Setup new search results; clears current page
    page = page || 1; // Default to page one

    // Clear current pagination
    $("#search_pagination .page").remove();

    // Build new pagination
    // Figure out max page and adjust page
    var maxPage = Math.ceil(students.length / studentsPerPage);
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
        var card = buildStudentCard(students[a]);
        $("#results").append(card);
        card.click(function(){
            $(this).toggleClass("selected");
        });
    }

    // Change page marker
    $("#search_pagination .page.active").removeClass("active");
    $("#search_pagination .page-"+page).addClass("active");
};