// Load our templates
var templates = {};
templates["card"] = "<div class=\"student_card\">\n    <div class=\"image\"></div>\n    <div class=\"information\">\n        <div class=\"student_name\"></div>\n        <div class=\"year\"></div>\n        <div class=\"major\">Course <span class=\"the_major\"></span></div>\n        <div class=\"interests\">Interests: <span class=\"list_interests\"></span></div>\n    </div>\n\n    <div class=\"clear\"></div>\n\n    <div class=\"buttons\">\n        <input type=\"button\" value=\"Hide\" class=\"hide-button btn btn-small\" />\n        <input type=\"button\" value=\"See Details\" class=\"details-button btn btn-small\" />\n        <input type=\"button\" value=\"Restore\" class=\"restore-button btn btn-small\" />\n    </div>\n</div>";
templates["send"] = "<div id=\"send_email\">\n    <div class=\"title\">\n        New E-mail\n        <!-- TODO: add x in upper-right -->\n    </div>\n    <hr />\n    <div class=\"students_holder\">\n        Students:\n    </div>\n    <div class=\"topic_bar\">\n        Subject:\n        <input type=\"text\" id=\"subject\" />\n    </div>\n    <div class=\"message_box\">\n        Message: <br />\n        <textarea id=\"message\">blargh</textarea>\n        <!-- TODO: adjust cols, rows of textarea -->\n    </div>\n    <div class=\"send\">\n        <input type=\"button\" value=\"Send\" id=\"send_email_button\" />\n    </div>\n\n</div>";
templates["sent"] = "<div id=\"sent_email\">\n    Your e-mail has been sent!<br /><br />\n    <input type=\"button\" value=\"Close Window\" />\n</div>";
templates["hidbar"] = "";
templates["hidden"] = "<div id=\"hidden_students\">\n    <div class=\"bottom-line\">\n        <div class=\"pull-right\">\n            <a href=\"#\" class=\"btn btn-primary\" id=\"restore_all_btn\">Restore All</a>\n        </div>\n\n        <h3>View Hidden Students</h3>\n    </div>\n    <div class=\"desc\">\n        Hit \"Restore\" to return the student to the search results.\n    </div>\n\n    <div id=\"hs_container\">\n        <div class=\"no_students\">\n            There are no hidden students currently.\n        </div>\n    </div>\n</div>";
templates["profile"] = "";
templates["confirm"] = "<div id=\"confirm\">\n    <div class=\"title bottom-line\">\n        Are you sure?\n        <!-- TODO: Need the closing x -->\n    </div>\n\n    <div class=\"message\">\n        Are you sure you wish to leave this page? (Your current search data will be lost.)\n        <br /><br />\n        <div class=\"buttons\">\n            <input type=\"button\" value=\"Yes\" class=\"yes\" />\n            <input type=\"button\" value=\"No\" class=\"no\" />\n        </div>\n    </div>\n</div>";
templates["surround"] = "<div id=\"surround\"></div>";
templates["no_students"] = "<div class=\"no_results\">\n    Your search does not match any students or you have hidden all students that match.\n</div>";
