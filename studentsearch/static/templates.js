// Load our templates
var templates = {};
templates["card"] = "<div class=\"student_card well\">\n    <div class=\"emailed\"></div>\n    <div class=\"image\"></div>\n    <div class=\"information\">\n        <div class=\"student_name\"></div>\n        <div class=\"year\"></div>\n        <div class=\"major\">Course <span class=\"the_major\"></span></div>\n        <div class=\"interests visible-desktop\">Interests: <span class=\"list_interests\"></span></div>\n    </div>\n\n    <div class=\"clear\"></div>\n\n    <div class=\"buttons\">\n        <input type=\"button\" value=\"Hide\" class=\"hide-button btn btn-small\" />\n        <input type=\"button\" value=\"See Details\" class=\"details-button btn btn-small\" />\n        <input type=\"button\" value=\"Restore\" class=\"restore-button btn btn-small\" />\n    </div>\n</div>";
templates["send"] = "<div id=\"send_email\" class=\"form-horizontal\">\n    <form action=\"javascript:void(0)\">\n        <div class=\"close_x\">&times;</div>\n        <div class=\"title\">\n            New E-mail\n        </div>\n        <hr />\n        <div class=\"control-group\">\n            <label class=\"control-label\">\n                Students: \n            </label>\n            <div class=\"controls students_holder\">\n                <span class=\"no_students\" style=\"display: none\">No students selected. <a href=\"#\">Click here to return.</a> (Your message will be saved.)</span>\n            </div>\n        </div>\n        <div class=\"topic_bar control-group\">\n            <label class=\"control-label\" for=\"subject\">\n                Subject:\n            </label>\n            <div class=\"controls\">\n                <input type=\"text\" id=\"subject\" name=\"subject\" required pattern=\".{1,}\" />\n            </div>\n        </div>\n        <div class=\"message_box\">\n            Message: <br />\n            <textarea id=\"message\" required pattern=\".{1,}\">blargh</textarea>\n        </div>\n        <div class=\"send\">\n            <button class=\"btn btn-primary\" type=\"submit\" id=\"send_email_button\">Send</button>\n            <a href=\"javascript:void(0)\" class=\"btn pull-right\" id=\"save_and_close_button\">Save and Close</a>\n        </div>\n    </form>\n</div>";
templates["sent"] = "<div class=\"alert alert-success\" id=\"sent_email\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n    Your e-mail has been sent successfully!\n</div>";
templates["hidbar"] = "<div class=\"alert\" id=\"hidbar\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n    You've chosen to hide a student - <a href=\"#\" class=\"undo\">Undo</a>\n</div>";
templates["hidden"] = "<div id=\"hidden_students\">\n    <div class=\"bottom-line\">\n        <div class=\"pull-right\">\n            <div class=\"close_x\">&times;</div>\n        </div>\n\n        <h3>View Hidden Students</h3>\n    </div>\n    <div class=\"desc\">\n        Hit \"Restore\" to return the student to the search results.\n    </div>\n\n    <div id=\"hs_container\" class=\"row\">\n        <div class=\"no_students span4\">\n            There are no hidden students currently.\n        </div>\n    </div>\n\n    <a href=\"#\" class=\"btn btn-primary\" id=\"restore_all_btn\">Restore All</a>\n</div>";
templates["profile"] = "<div class=\"profile\">\n    <div class=\"close_x\">&times;</div>\n    <div class=\"image\"></div>\n    <div class=\"information\">\n        <div class=\"student_name\"></div>\n        <div class=\"year\"></div>\n        <div class=\"major\"></div>\n        \n        <input type=\"button\" value=\"Resume\" class=\"resume btn\" />\n        <input type=\"button\" value=\"Recommendations\" class=\"recs btn\" />\n    </div>\n\n    <div class=\"tab_holder\">\n        <ul id=\"myTab\" class=\"nav nav-tabs\">\n            <li class=\"active\"><a href=\"#courses_tab\" data-toggle=\"tab\">Courses</a></li>\n            <li><a href=\"#skills_tab\" data-toggle=\"tab\">Skills</a></li>\n            <li><a href=\"#interests_tab\" data-toggle=\"tab\" class=\"interests\">Interests</a></li>\n        </ul>\n        <div id=\"myTabContent\" class=\"tab-content\">\n            <div class=\"tab-pane fade in active\" id=\"courses_tab\"></div>\n            <div class=\"tab-pane fade\" id=\"skills_tab\"></div>\n            <div class=\"tab-pane fade\" id=\"interests_tab\" class=\"interests\"></div>\n        </div>\n    </div>\n\n</div>";
templates["confirm"] = "<div id=\"confirm\">\n    <div class=\"title bottom-line\">\n        <span class=\"title_area\"></span>\n    </div>\n\n    <div class=\"message\">\n        <span class=\"mess_area\"></span>\n        <br /><br />\n        <div class=\"buttons\">\n            <input type=\"button\" value=\"Yes\" class=\"yes btn btn-danger\" />\n            <input type=\"button\" value=\"No\" class=\"no btn btn-primary\" />\n        </div>\n    </div>\n</div>";
templates["surround"] = "<div id=\"surround\"></div>";
templates["no_students"] = "<div class=\"no_results\">\n    Your search does not match any students.\n    <span class=\"count_hidden\">\n        (You have hidden <span class=\"number\"></span> that would match your current search criteria.)\n    </span>\n</div>";
templates["pick_tag"] = "<div class=\"pick_tag\">\n    <div>\n    <div class=\"close_x\">&times;</div>\n        <div class=\"title bottom-line\">\n            <span class=\"title_area\">We're Confused</span>\n        </div>\n        We couldn't determine what you meant by \n        <b class=\"original_phrase\"></b>\n        <br /><br />\n        Please pick one of the following options:\n        <form class=\"tehForm\">\n            <ul class=\"valOptions\"></ul>\n            <input type=\"submit\" value=\"Use Selected Value\" class=\"btn btn-primary\" />\n            <input type=\"button\" id=\"cancel_this\" value=\"Cancel and Edit\" class=\"btn btn-danger pull-right\" />\n        </form>\n    </div>\n</div>";
