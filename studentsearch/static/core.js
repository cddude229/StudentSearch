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

var courseNameById = function(id){
    for(var a=0;a<courses.length;a++){
        for(var b=0;b<courses[a].list_of_numbers.length;b++){
            if(courses[a].list_of_numbers[b] == id){
                return courses[a].real_name;
            }
        }
    }
    return "Unknown Class";
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
        $(".interests", holder).hide();
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

    // Show email icon
    if(student.emailed){
        $(".emailed", holder).popover({
            content: "You e-mailed " + student.first_name + " at " + student.emailTime,
            placement: "right",
            trigger: "hover"
        });
    } else {
        $(".emailed", holder).remove();
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
        var wasSelected = false;
        if(state.selectedStudents.hasItem(student.id)){
            state.selectedStudents.removeItem(student.id);
            wasSelected = true;
        }
        state.hiddenStudents.addItem(student.id);
        showHiddenStudentBar(student.id, wasSelected);
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

    // Clear current pagination, no results message
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
    hideHiddenStudentBar();

    // Assign everything to a tempHolder, then replace at once.  This fixes the flicker bug
    var tempHolder = $("<div>");

    // Show students
    var start = studentsPerPage * (page - 1);
    var end = start + studentsPerPage;
    end = Math.min(end, students.length)
    for(var a=start;a<end;a++){
        var card = buildStudentCard(students[a]);
        tempHolder.append(card);

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

    $("#results *").remove();
    $("#results").append(tempHolder);

    // Show "no students" message if no students
    if($("#results .student_card_surround").length == 0){
        $("#results").append($("<div>").html(templates["no_students"]));
        var i = state.knownHidden;
        $("#results .count_hidden .number").html(i + (i == 1?" student":" students"));
    }

    // Change page marker
    $("#search_pagination .page.active").removeClass("active");
    $("#search_pagination .page-"+page).addClass("active");
};

var buildSurround = function(template, closeHandle){
    var ele = $(templates["surround"]);
    ele.html(templates[template]);

    closeHandle = closeHandle || closeSurround;

    // Close handler
    ele.click(function(e){
        if(e.target == ele[0]){
            // Only close if they clicked on the background; not a child
            closeHandle();
        }
    });

    ele.appendTo(document.body);
    return ele;
};

var closeSurround = function(e){
    stopEvents(e);
    $("#surround").remove();
};

$(document).keyup(function(e){
    if(e.keyCode == 27){
        closeSurround(e);
    }
});

var showEmailForm = function(){
    var ele = buildSurround("send");
    $("#subject").val(state.currentTitle).keyup(function(){
        state.currentTitle = this.value;
        updateButtons();
    });
    $("#message").val(state.currentMessage).keyup(function(){
        state.currentMessage = this.value;
        updateButtons();
    });
    $("form", ele).submit(function(e){
        stopEvents(e);
        return false;
    });
    $("#send_email_button").click(function(e){
        //stopEvents(e);

        if(state.selectedStudents.hasItems() === false || state.currentTitle == "" || state.currentMessage == "") return;

        // Mark students as read
        $.ajax({
            method: "post",
            url: "./email",
            data: {
                ids: state.selectedStudents.getAllItems().join(",")
            },
            async: false
        });

        // Show sent message
        state.currentTitle = state.currentMessage = "";
        state.selectedStudents.clear();
        closeSurround();
        showEmailSent();
        updateButtons();
    });
    $("#save_and_close_button").click(closeSurround);
    $(".no_students a").click(function(e){
        stopEvents(e);
        closeSurround();
    });

    var selStud = state.selectedStudents.getAllItems();
    var students = [];
    $.ajax({
        method: "get",
        url: "./get_students",
        data: {
            ids: selStud.join(",")
        },
        dataType: "json",
        success: function(studs){
            students = studs;
        },
        async: false
    });
    for(var a=0;a<students.length;a++){
        var student = students[a];
        var delCallback = (function(currentId){
            return function(e){
                stopEvents(e);
                state.selectedStudents.removeItem(currentId);
                $(this).parent(".tag").remove();
            };
        })(student.id);

        buildTag(student.first_name, delCallback).appendTo(".students_holder", ele);
    }
};

var showEmailSent = function(){
    $("#alert_holder").html(templates["sent"]);
};

var showHiddenStudentBar = function(id, wasSelected){
    $("#alert_holder").html(templates["hidbar"]);
    $("#alert_holder .undo").click(function(){
        state.hiddenStudents.removeLast();
        if(wasSelected){
            state.selectedStudents.addItem(id);
        }
        hideHiddenStudentBar();
    });
};

var hideHiddenStudentBar = function(){
    $("#alert_holder *").remove();
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

            // Load them from the backend
            var students = [];
            $.ajax({
                method: "get",
                url: "./get_students",
                data: {
                    ids: hiddenStudents.join(",")
                },
                dataType: "json",
                success: function(studs){
                    students = studs;
                },
                async: false
            });

            for(var a=0;a<students.length;a++){
                var student = students[a];

                var holder = buildStudentCard(student);
                $("#hs_container").append(holder);

                // Restore individual student
                var func = (function(studentId){
                    return function(e){
                        stopEvents(e);
                        state.hiddenStudents.removeItem(studentId);
                        hiddenStudentsList();
                    };
                })(student.id);
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


    var addToHolder = function(par, list, toolTipFunc){
        toolTipFunc = toolTipFunc || function(){ return false; }

        par = $("<ul>").appendTo($(par));

        for(var a=0;a<list.length;a++){
            var div = $("<li>").addClass("item");
            var span = $("<span>").html(list[a]).appendTo(div);
            var tt = toolTipFunc(list[a]);
            if(tt){
                span.tooltip({
                    title: tt,
                    placement: "right"
                });
            }
            div.appendTo(par);
        }
    };

    // Do interests
    if(student.interests_list.length == 0){
        $(".interests", holder).hide();
    } else {
        var interests = student.interests_list;
        addToHolder($("#interests_tab"), interests);
    }

    // Do courses
    addToHolder("#courses_tab", student.courses_ids, courseNameById);
    addToHolder("#skills_tab", student.skills_ids);

    // Do image
    var titleStr = "Image of " + studentName;
    // Use studentName of first_name because first names are common
    $("<img>")
        .attr("src", imagesDir + student.image)
        .attr("title", titleStr)
        .attr("alt", titleStr)
        .appendTo($(".image", holder));

    // Resume, recommendations
    $(".resume", holder).click(function(){
        window.open("./static/docs/dummy_resume.pdf");
    });

    $(".recs", holder).click(function(){
        window.open("./static/docs/dummy_recommendations.pdf");
    });
};

var showConfirm = function(yesCallback, noCallback, title, mess, yes, no){
    var ele = buildSurround("confirm");

    yesCallback = yesCallback || closeSurround;
    noCallback = noCallback || closeSurround;

    $(".yes", ele).click(yesCallback).val(yes);
    $(".no", ele).click(noCallback).val(no);

    $(".title_area", ele).html(title);
    $(".mess_area", ele).html(mess);
};

var showPickTag = function(phrase, tags, callback, inputField){
    var closeHandle = function(){
        closeSurround();
        inputField.focus();
    };
    var ele = buildSurround("pick_tag", closeHandle);

    // Show original phrase
    $(".original_phrase", ele).html(phrase);

    // Show tags
    var i = 1;
    _.each(tags, function(tag){
        var li = $("<li>").appendTo($("ul", ele));
        var label = $("<label for='sexyBitch" + i + "'>");

        var input = $("<input type='radio' name='sexyBitch' id='sexyBitch" + i + "' />").val(tag);

        label
            .append(input)
            .append(document.createTextNode(" " + tag))
            .appendTo(li);

        i++;
    });

    // Give focus to first item
    $($("input", ele)[0]).focus().attr("checked", true);

    // Form handling
    $("form", ele).submit(function(e){
        stopEvents(e);
        var val = $('input[name=sexyBitch]:checked', this).val();
        callback(val);

        closeSurround();
        return false;
    });

    $("#cancel_this").click(closeHandle);

    $(".pick_tag", ele).height($(".pick_tag div", ele).height());
};

var stopEvents = function(e){
    if(e){
        e.preventDefault();
        e.stopPropagation();
    }
};