// Load our templates
var templates = {};
templates["card"] = "<div class=\"student_card\">\n    <div class=\"image\"></div>\n    <div class=\"information\">\n        <div class=\"student_name\"></div>\n        <div class=\"year\"></div>\n        <div class=\"major\">Course <span class=\"the_major\"></span></div>\n        <div class=\"interests\">Interests: <span class=\"list_interests\"></span></div>\n    </div>\n\n    <div class=\"clear\"></div>\n\n    <div class=\"buttons\">\n        <input type=\"button\" value=\"Hide\" class=\"hide-button btn btn-small\" />\n        <input type=\"button\" value=\"See Details\" class=\"details-button btn btn-small\" />\n        <input type=\"button\" value=\"Restore\" class=\"restore-button btn btn-small\" />\n    </div>\n</div>";
templates["send"] = "<div class=\"send_email\">\n    <div class=\"title\">\n        New E-mail\n        <!-- TODO: add x in upper-right -->\n    </div>\n    <hr />\n    <div class=\"students_holder\">\n        Students:\n    </div>\n    <div class=\"topic_bar\">\n        Subject:\n        <!-- TODO: Input goes here -->\n    </div>\n    <div class=\"message_box\">\n        Message: <br />\n        <textarea>blargh</textarea>\n        <!-- TODO: adjust cols, rows of textarea -->\n    </div>\n    <div class=\"send\">\n        <input type=\"button\" value=\"Send\" />\n    </div>\n\n</div>";
templates["sent"] = "<div class=\"sent_email\">\n    Your e-mail has been sent!\n</div>";
templates["hidbar"] = "";
templates["hidden"] = "";
templates["profile"] = "";
templates["confirm"] = "";
