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
    print "this is by id"
    print byID
    for student in students:
        print "this is confusing"
        print type(student)
    
    # @Jess: Ok, filter students to only contain those with IDs in byID!
    for s in students:
        if str(s['id']) not in byID:
            students.remove(s)
    # I think this is done -Jess



    # DON'T TOUCH
    # Frontend relies on this format!
    return json.dumps(addEmailIndicator(students))


def addEmailIndicator(studentsToEmail):
    # @Jess: Add the email indicator to the students here
    # Look at emailStudents.py if you need help
    # emailStudents.addStudents, emailStudents.getStudents
    time = str(datetime.datetime.now())
    for student in studentsToEmail:
        student['emailed'] = True
        student['emailTime'] = time
    return studentsToEmail #updated to have dict key of emailed and emailTime
    #I think this is done -Jess


@app.route('/email', methods=['POST'])
def markAsEmailed():
    ids = request.form["ids"].split(",")
    students = data.students
    emailed = []
    for student in students:
        sID = str(student['id'])
        if sID in ids:
            emailed.append(student)
    emailStudents.addStudents(getCurrentEmail(),emailed)
    #@Jess: Add these to the current user's list to mark as read!
    #@Chris don't know what this is asking - Jess
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
    for s in students:
        sID = s['id']
        if sID in hiddenStudents:
            students.remove(s)
            hiddenStudentsThatMatch.append(sID)
            

    # @Jess: Only show the students whose years are in shownYears
    for s in students:
        sYear = s['class_year']
        if sYear not in shownYears:
            students.remove(s)
            

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
    return ""


# Main call
if __name__ == '__main__':
    app.run(debug=True)
