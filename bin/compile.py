import json

# Must be run from bin's parents directory, currently
# TODO: Get rid of that requirement

# Helper functions for reading files
def readFile(filePath, prefix=""):
    f = open(filePath)
    content = f.read()
    f.close()
    if prefix != "":
        content = content.split("\n")
        content = [prefix + line for line in content]
        content = "\n".join(content)
    return content

def fileToJSON(filePath):
    return json.dumps(readFile(filePath))

# Load templates
cardTemplate = fileToJSON("templates/student_card.html")
sendTemplate = fileToJSON("templates/send_email.html")
sentTemplate = fileToJSON("templates/sent_email.html")
hidBarTemplate = fileToJSON("templates/hid_student_bar.html")
hiddenTemplate = fileToJSON("templates/hidden_students.html")
profileTemplate = fileToJSON("templates/student_profile.html")
confirmTemplate = fileToJSON("templates/yes_no_confirmation.html")
surroundTemplate = fileToJSON("templates/surround.html")

# Build our custom template.
# Wrap everything in a function so that it's nice
theTemplate = """// Load our templates
var templates = {};
templates["card"] = %s;
templates["send"] = %s;
templates["sent"] = %s;
templates["hidbar"] = %s;
templates["hidden"] = %s;
templates["profile"] = %s;
templates["confirm"] = %s;
templates["surround"] = %s;
""" % \
(cardTemplate, sendTemplate, sentTemplate, hidBarTemplate, hiddenTemplate,\
 profileTemplate, confirmTemplate, surroundTemplate)

f = open("templates.js", "w")
f.write(theTemplate)
f.close()

# TODO: Make compiled.js be compressed