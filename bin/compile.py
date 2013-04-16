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

# Build our custom template.
# Wrap everything in a function so that it's nice
theTemplate = """// Load our templates
var templates = {};
templates["card"] = %s;""" % \
(cardTemplate)

f = open("templates.js", "w")
f.write(theTemplate)
f.close()

# TODO: Make compiled.js be compressed