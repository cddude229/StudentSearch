// Main functions for use
var yearToGradeMap = {
    2016: "Freshman",
    2015: "Sophomore",
    2014: "Junior",
    2013: "Senior",
    2012: "Graduate"
};
var yearToGrade = function(year){
    // Converts a year to a grade (2013 -> senior), given a base year
    return yearToGradeMap[year]
};

var idToMajor = function(id){
    // Converts a major's ID to its object
    return majors[id];
};

var idToCourse = function(id){
    // Converts a courses's ID to its object
    return courses[id];
};

var idToStudent = function(id){
    return students[id];
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

    // Hide student event handlers
    $(".hide-button", holder).click(function(){
        state.selectedStudents.removeItem(student.id);
        state.hiddenStudents.addItem(student.id);
    });

    return holder;
};

var buildTag = function(content){
    var tag = $("<div>");
    tag.addClass("tag");
    tag.html(content);
    // TODO: Add deletion x
    return tag;
};

var updateResults = function(students, page){
    // Setup new search results; clears current page
    page = page || state.currentPage || 1; // Default to page one

    // Clear current pagination
    $("#search_pagination .page").remove();

    // Build new pagination
    // Figure out max page and adjust page
    var maxPage = Math.ceil(students.length / studentsPerPage);
    page = Math.min(page, maxPage); // Limit to the max page
    if(page == 0) page = 1; // Bug fix

    // Add elements
    for(var a=1;a<=maxPage;a++){
        var ele = $("<li>").addClass("page page-"+a);
        var an = $("<a href='#'>").html(a).appendTo(ele);
        //if(a == page) ele.addClass("active"); // Added later by call to changePage()

        var func = (function(currentA){
            return function(){
                state.currentPage = currentA;
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
    $("#results *").remove();

    // Show students
    var start = studentsPerPage * (page - 1);
    var end = start + studentsPerPage;
    end = Math.min(end, students.length)
    for(var a=start;a<end;a++){
        var card = buildStudentCard(students[a]);
        $("#results").append(card);

        if(state.selectedStudents.hasItem(students[a].id)){
            card.addClass("selected");
        }

        var func = (function(currentStudent){
            return function(){
                var t = $(this);
                if(t.hasClass("selected")){
                    t.removeClass("selected");
                    state.selectedStudents.removeItem(currentStudent);
                } else {
                    state.selectedStudents.addItem(currentStudent);
                    t.addClass("selected");
                }
            };
        })(students[a].id);

        card.click(func);
    }
    // TODO: If no students to show, show no students message

    // Change page marker
    $("#search_pagination .page.active").removeClass("active");
    $("#search_pagination .page-"+page).addClass("active");
};

var buildSurround = function(template){
    var ele = $(templates["surround"]);
    ele.html(templates[template]);
    return ele;
    // TODO: Attach close event
};

var showEmailForm = function(){
    var ele = buildSurround("send");
    ele.appendTo(document.body);
};

var showHiddenStudents = function(){
    var ele = buildSurround("hidden");
    ele.appendTo(document.body);
};

var stopEvents = function(e){
    if(e){
        e.preventDefault();
        e.stopPropagation();
    }
};