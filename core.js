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
    var holder = $("<div>").html(templates["card"]).addClass("student_card_surround span4");

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
        showHiddenStudentBar();
    });

    $(".details-button", holder).click(function(e){
        stopEvents(e);
        showStudentView(student);
    });

    return holder;
};

var buildTag = function(content, delCallback){
    var tag = $("<div>");
    tag.addClass("tag label");
    var theX = "<span class='del_x label label-important' alt='Click to Remove' title='Click to Remove'>x</span>";
    tag.html(content + theX);
    if(delCallback){
        $(".del_x", tag).click(delCallback);
    }
    return tag;
};

var updateResults = function(students, page){
    // Setup new search results; clears current page
    page = page || state.currentPage || 1; // Default to page one

    // Clear current pagination
    $("#search_pagination .page, #results .no_results").remove();

    // Build new pagination
    // Figure out max page and adjust page
    var maxPage = Math.ceil(students.length / studentsPerPage);
    page = Math.min(page, maxPage); // Limit to the max page
    if(page == 0) page = 1; // Bug fix

    // Add elements
    for(var a=1;a<=maxPage;a++){
        var ele = $("<li>").addClass("page page-"+a);
        var an = $("<a href='#'>").html(a).appendTo(ele);

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

    // Show "no students" message if no students
    if($("#results .student_card_surround").length == 0){
        $("#results").append($("<div>").html(templates["no_students"]));
    }

    // Change page marker
    $("#search_pagination .page.active").removeClass("active");
    $("#search_pagination .page-"+page).addClass("active");
};

var buildSurround = function(template){
    var ele = $(templates["surround"]);
    ele.html(templates[template]);

    // Close handler
    ele.click(function(e){
        if(e.target == ele[0]){
            // Only close if they clicked on the background; not a child
            closeSurround();
        }
    });

    // TODO: Should close if they hit escape

    ele.appendTo(document.body);
    return ele;
};

var closeSurround = function(e){
    stopEvents(e);
    $("#surround").remove();
};

var showEmailForm = function(){
    // TODO: Need to add X to close
    var ele = buildSurround("send");
    $("#subject").val(state.currentTitle).keyup(function(){
        state.currentTitle = this.value;
    });
    $("#message").val(state.currentMessage).keyup(function(){
        state.currentMessage = this.value;
    });
    $("#send_email_button").click(function(e){
        stopEvents(e);

        if(state.selectedStudents.hasItems() === false) return;

        // Show sent message
        state.currentTitle = state.currentMessage = "";
        closeSurround();
        showEmailSent();
    });

    var selStud = state.selectedStudents.getAllItems();
    for(var a=0;a<selStud.length;a++){
        var id = selStud[a];
        var student = idToStudent(id);
        var delCallback = (function(currentId){
            return function(e){
                stopEvents(e);
                state.selectedStudents.removeItem(currentId);
                $(this).parent(".tag").remove();
                // TODO: Show "no students selected" message
                // TODO: Fix subject and message to be a label for form fields (so that they're inline as well)
            };
        })(id);

        buildTag(student.first_name, delCallback).appendTo(".students_holder", ele);
    }
};

var showEmailSent = function(){
    $("#alert_holder").html(templates["sent"]);
};

var showHiddenStudentBar = function(){
    $("#alert_holder").html(templates["hidbar"]);
    $("#alert_holder .undo").click(function(){
        state.hiddenStudents.removeLast();
    })
};

var hiddenStudentsList = function(){
    var hiddenStudents = state.hiddenStudents.getAllItems();
    if($("#hs_container").length > 0){
        $("#hs_container .student_card_surround").remove();
        if(hiddenStudents.length == 0){
            $("#restore_all_btn").removeClass("btn-primary").addClass("disabled");
            $("#hs_container .no_students").show();
            $("#hidden_students .desc").hide();
        } else {
            $("#hs_container .no_students").hide();
            $("#hidden_students .desc").show();
            for(var a=0;a<hiddenStudents.length;a++){
                var id = hiddenStudents[a];
                var student = idToStudent(id);

                var holder = buildStudentCard(student);
                $("#hs_container").append(holder);

                // Restore individual student
                var func = (function(studentId){
                    return function(e){
                        stopEvents(e);
                        state.hiddenStudents.removeItem(studentId);
                        hiddenStudentsList();
                    };
                })(id);
                $(".restore-button", holder).click(func);
            }
        }
    }

    if(hiddenStudents.length == 0){
        $("#hidbar").remove();
    }
};

var showHiddenStudents = function(){
    var ele = buildSurround("hidden");

    $("#restore_all_btn").click(function(){
        state.hiddenStudents.clear();
    });

    // TODO: Bug - Have to hide details button on this page because of stacking and return issues

    hiddenStudentsList();
};

var showStudentView = function(student){
    var holder = buildSurround("profile");

    // Assign data
    var studentName = student.first_name + " " + student.last_name;
    $(".student_name", holder).html(studentName);
    $(".year", holder).html(yearToGrade(student.class_year));
    $(".major", holder).html("Course " + student.major_id + ": " + idToMajor(student.major_id).name);

    // Do interests
    if(student.interests_list.length == 0){
        $(".interests").hide();
    } else {
        var interests = student.interests_list;
        $(".list_interests", holder).html(interests.join(", "));
    }

    // Do courses
    $(".list_courses", holder).html(student.courses_ids.join(", "));
    $(".list_skills", holder).html(student.skills_ids.join(", "));


    // Do image
    var titleStr = "Image of " + studentName;
    // Use studentName of first_name because first names are common
    $("<img>")
        .attr("src", imagesDir + student.image)
        .attr("title", titleStr)
        .attr("alt", titleStr)
        .appendTo($(".image", holder));

    // TODO: resume, recs buttons do something
};

var showConfirm = function(yesCallback, noCallback){
    var ele = buildSurround("confirm");
    yesCallback = yesCallback || closeSurround;
    noCallback = noCallback || closeSurround;

    $(".yes", ele).click(yesCallback);
    $(".no", ele).click(noCallback);
};

var stopEvents = function(e){
    if(e){
        e.preventDefault();
        e.stopPropagation();
    }
};