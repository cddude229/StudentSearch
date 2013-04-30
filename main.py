from flask import Flask, jsonify, request, session, render_template, redirect, url_for
import json
import datetime
import emailStudents
from data import data
from filter import objectFilter



app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'



#@Tanya: Make sure everything that requires a username is behind login!


@app.route('/', methods=['GET'])
def index():
    # @Tanya: Make this show index.html if logged in
    return render_template('./index.html')


@app.route('/get_students')
def get_students():
    byID = request.args.get("ids", "").split(",")
    if "ids" in request.form:
       byID = request.form["ids"].split(",")

    students = data.students[:]
    
    # Filter students to only contain those with IDs in byID
    if len(byID) > 0:
        students = [s for s in students if str(s["id"]) in byID]

    # DON'T TOUCH
    # Frontend relies on this format!
    return json.dumps(addEmailIndicator(students))


def addEmailIndicator(studentsToEmail):
    studs = emailStudents.getStudents(getCurrentEmail())
    for s in studentsToEmail:
        s["emailed"] = False
        for stud in studs:
            if stud["id"] == str(s["id"]):
                s["emailed"] = True
                s["emailTime"] = stud["time"]

    return studentsToEmail #updated to have dict key of emailed and emailTime


@app.route('/email', methods=['POST'])
def markAsEmailed():
    ids = request.form["ids"].split(",")
    time = str(datetime.datetime.now())
    emailed = []
    for id in ids:
        if str(id) in ids:
            emailed.append({
                "id": id,
                "time": time
            })
    emailStudents.addStudents(getCurrentEmail(),emailed)
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
    if len(hiddenStudents) > 0:
        hiddenStudentsThatMatch = [s["id"] for s in students if str(s["id"]) in hiddenStudents]
        students = [s for s in students if str(s["id"]) not in hiddenStudents]
            

    # @Jess: Only show the students whose years are in shownYears
    students = [s for s in students if str(s["class_year"]) in shownYears]
            

    # @Jess: Ok, now sort the sutdents by searchOrder!
    # either "alphabetical" or "grade"
    students = sorted(students, key = lambda k: k['first_name'])
    students = sorted(students, key = lambda k: k['last_name'])
    if searchOrder == 'grade':
        students = sorted(students, key = lambda k: k['class_year'], reverse = True)


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
    pass


@app.route('/register', methods=['POST', 'GET'])
def runRegister():
    # @Tanya: Your code will go here to create a registration
    # 1) If get, return register.html
    # 2) If post, validate the login credentials
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
    return "testing123"


# Main call
if __name__ == '__main__':
    app.run(debug=True)
