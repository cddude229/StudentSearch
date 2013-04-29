from flask import Flask, jsonify, request, session, render_template, redirect, url_for
import json
import emailStudents
from data import data
from filter import objectFilter



app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'



#@Tanya: Make sure everything that requires a username is behind login! (if not logged in when doing something, redirect to login page 
# 			(including search and stuff)


@app.route('/', methods=['GET'])
def index():
    # @Tanya: Make this show index.html if logged in
	# login page requires email and password
	# if logged in: 
    return render_template('./index.html')
	# if not logged in, render_template('./login.html')


@app.route('/get_students')
def get_students():
    byID = request.args.get("ids", "").split(",")

    students = data.students[:]

    if len(byID) > 0:
        # @Jess: Ok, filter students to only contain those with IDs in byID!
        pass


    # DON'T TOUCH
    # Frontend relies on this format!
    return json.dumps(addEmailIndicator(students))


def addEmailIndicator(students):
    # @Jess: Add the email indicator to the students here
    # Look at emailStudents.py if you need help
    # emailStudents.addStudents, emailStudents.getStudents
    return students


@app.route('/email', methods=['POST'])
def markAsEmailed():
    ids = request.form["ids"].split(",")
    #@Jess: Add these to the current user's list to mark as read!
    return "" # Errors if no return


@app.route('/search', methods=['POST'])
def runSearch():
    # Get everything from the UI for a search
    hiddenStudents = request.form["hidden_ids"].split(",")
    shownYears = request.form["shown_years"].split(",")
    coursesString = request.form["coursesString"]
    skillsString = request.form["skillsString"]
    searchOrder = request.form["sortOrder"] # alphabetical, grade

    # Grab students, then filter by courses and skills
    students = data.students[:]
    students = objectFilter(students, "course_list", coursesString)
    students = objectFilter(students, "skills_list", skillsString)

    students = addEmailIndicator(students)

    # Ok, now do the hidden students!
    hiddenStudentsThatMatch = [] # List of IDs of students who are still in the results

    # @Jess: Iterate over students; remove students whose ID is in hidden students
    # Then, add their ID to "hidden students that match"

    # @Jess: Only show the students whose years are in shownYears

    # @Jess: Ok, now sort the sutdents by searchOrder!
    # either "alphabetical" or "grade"


    # Lastly, compile JSON and return it
    ret = {
        "hiddenStudents": hiddenStudentsThatMatch,
        "numberMatchHidden": len(hiddenStudentsThatMatch),
        "results": students
    }
    return json.dumps(ret)


@app.route('/login', methods=['POST', 'GET'])
def runLogin():
    # @Tanya: Your code will go here to validate a login
    # If it's a get request, return the login.html page
	# if post, validate login credentials (email uname and password match database)
    pass


@app.route('/register', methods=['POST', 'GET'])
def runRegister():
    # @Tanya: Your code will go here to create a registration
    # 1) If get, return register.html
    # 2) If post, validate the login credentials (Check if pws match, if emails been used before, if email has @, .)
    # 3) If login credentials are invalid, return register.html with an error message
    # 4) If login credentials are valid, direct to index.html
    pass


@app.route('/logout', methods=['GET'])
def runLogout():
    # @Tanya: Log them out and return to the login page
    pass


@app.route('/get_data')
def getData():
    # Get all data, except students
    dat = {
        "majors": data.majors,
        "courses": data.courses,
        "skills": data.skills
    }

    # DON'T TOUCH
    # Frontend relies on this format!
    return json.dumps(dat)


# Helper methods
def getCurrentEmail():
    # @Tanya: Return the logged in email
    return ""


# Main call
if __name__ == '__main__':
    app.run(debug=True)
