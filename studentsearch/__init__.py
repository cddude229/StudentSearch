from flask import Flask, g, jsonify, request, session, render_template, redirect, url_for
import json
import datetime
import emailStudents
import shelve
import hashlib
from data import data
from filter import objectFilter



app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

pass_min = 7
pass_max = 100



@app.route('/', methods=['GET'])
def index():
    if is_loggedin():
        return render_template('./index.html')
    return redirect(url_for('login')) # returns to login if not logged in


@app.route('/get_students')
def get_students():
    if is_loggedin() == False:
        return redirect(url_for('login'))

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
    if is_loggedin() == False:
        return redirect(url_for('login'))

    ids = request.form["ids"].split(",")
    time = str(datetime.datetime.now().strftime("%I:%M %p on %B %d, %Y"))
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
def search():
    if is_loggedin() == False:
        return redirect(url_for('login'))

    # Get everything from the UI for a search
    hiddenStudents = request.form["hidden_ids"].split(",")
    showEmailedStudents = request.form["show_emailed"].lower() == "true"
    shownYears = request.form["shown_years"].split(",")
    coursesString = request.form["coursesString"]
    skillsString = request.form["skillsString"]
    searchOrder = request.form["sortOrder"] # alphabetical, grade

    # Grab students, then filter by courses and skills
    students = data.students[:]
    students = objectFilter(students, "course_list", coursesString)
    students = objectFilter(students, "skills_ids", skillsString)

    students = addEmailIndicator(students)

    # Ok, now do the hidden students!
    hiddenStudentsThatMatch = [] # List of IDs of students who are still in the results

    # Iterate over students; remove students whose ID is in hidden students
    # Then, add their ID to "hidden students that match"
    if len(hiddenStudents) > 0:
        hiddenStudentsThatMatch = [s["id"] for s in students if str(s["id"]) in hiddenStudents]
        students = [s for s in students if str(s["id"]) not in hiddenStudents]

    if showEmailedStudents == False:
        students = [s for s in students if s["emailed"] == False]
            

    # Only show the students whose years are in shownYears
    students = [s for s in students if str(s["class_year"]) in shownYears]
            

    # Ok, now sort the sutdents by searchOrder!
    # either "alphabetical" or "grade"
    students = sorted(students, key = lambda k: k['first_name'])
    students = sorted(students, key = lambda k: k['last_name'])
    if searchOrder == 'grade':
        students = sorted(students, key = lambda k: k['class_year'])


    # Lastly, compile JSON and return it
    ret = {
        "hiddenStudents": hiddenStudentsThatMatch,
        "numberMatchHidden": len(hiddenStudentsThatMatch),
        "results": students
    }
    return json.dumps(ret)


@app.route('/login', methods=['POST', 'GET'])
def login():
    g.pass_max = str(pass_max)
    g.pass_min = str(pass_min)
    # @Tanya: Your code will go here to validate a login
    if is_loggedin():
        #session['error'] = 'You are already logged in!'
        return redirect(url_for('index'))
    
    if request.method == 'GET':
        email = request.args.get("email", "")
        registered = False
        if valid_uname(email) == False:
            email = ""
        else:
            registered = True
        return render_template('./login.html', email=email, registered=registered)
    else:
        # get username and pw from form
        uname = str(request.form["uname_box"])
        inputpw = str(request.form["pw_box"])

		# check if uname and pw are valid things
        if valid_uname(uname) == False:
            session["error"] = "Your username is not a valid format; it should be an email address."
            return render_template('./login.html', error=session["error"])

        if valid_pw(inputpw) == False:
            session["error"] = "Your password is incorrect."
            return render_template('./login.html', error=session["error"], email=uname)

        valid1 = check_database(uname)
        valid2 = check_database(uname, inputpw)
		
		# if no, login again
        if valid2 == False:
            if valid1:
                session["error"] = "Your password does not match your username."
            else:
                session["error"] = "Your username is not registered."
                uname = ""
            return render_template('./login.html', error=session["error"], email=uname)

		# if yes, login (set session user to username)
        session["username"] = uname
        return redirect(url_for('index'))


@app.route('/register', methods=['POST', 'GET'])
def register():
    # @Tanya: Your code will go here to create a registration
    # 1) If get, return register.html
    # 2) If post, validate the login credentials (Check if pws match, if emails been used before, if email has @, .)
    # 3) If login credentials are invalid, return register.html with an error message
    # 4) If login credentials are valid, direct to index.html (also add to shelve database
    g.pass_max = str(pass_max)
    g.pass_min = str(pass_min)
    if is_loggedin():
        #session["error"] = 'You are already logged in!'
        return redirect(url_for('index'))

    if request.method == 'GET':
        return render_template('./register.html')
    else:
        uname = str(request.form["uname_box"])
        pw1 = str(request.form["pw_box"])
        pw2 = str(request.form["pw_confirm_box"])
        
        if valid_uname(uname) == False:
            if len(uname) < 1:
                session["error"] = "Your username is too short. Please make sure it is an email address longer than 1 character."
            if len(uname) > 30:
                session["error"] = "Your username is too long. Please make sure it is an email address shorter than 30 characters."
            session["error"] = "Your username is not a valid email address. Please use characters limited to a-z, A-Z, 0-9, @, _, -, ., +"
            uname = ""
            return render_template('./register.html', error=session["error"])

        if pw1 != pw2:
            session["error"] = "Your passwords do not match. Please try again."
            return render_template('./register.html', error=session["error"], email=uname)

        if valid_pw(pw1) == False:
            if len(inputpw) > pass_max:
                session["error"] = "Your password is too long. Please make sure it is shorter than " + pass_max + " characters."
            if len(inputpw) < pass_min:
                session["error"] = "Your password is too short. Please make sure it is longer than " + pass_min + " characters."
            return render_template('./register.html', error=session["error"], email=uname)

        if check_database(uname):
            session["error"] = "That username is already in use. Please enter another email address."
            return render_template('./register.html', error=session["error"], email=uname)

        dict = shelve.open("users")
        dict[uname] = hashlib.sha256(pw1).hexdigest()
        dict.close()
        return redirect(url_for('login', email=uname))


@app.route('/logout', methods=['GET'])
def logout():
    # @Tanya: Log them out and return to the login page
    if is_loggedin():
        del session["username"] # does this work?
    return redirect(url_for('login'))


@app.route('/get_data')
def getData():
    if is_loggedin() == False:
        return redirect(url_for('login'))

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
    return str(session["username"])
    #return "blahblahblahblahpoop" # enabling search w/ login disabled
	
# Tanya's helper methods 
def is_loggedin():
    if "username" in session and check_database(session["username"]):
        print "you are logged in"
        return True
    print "you are not logged in"
    return False
	
def check_database(username, password = False):
    valid_entry = False
    dict = shelve.open("users") # Dictionary of username and hashedpw.hexdigest()
    hashed_inputpw = hashlib.sha256(str(password)).hexdigest()
    if dict.has_key(username):
        if password == False or hashed_inputpw == dict[username]:
            valid_entry = True
    dict.close()
    return valid_entry
	
def valid_uname(username):
    if len(username) < 1:
        return False
    if len(username) > 30:
        return False
    atCount = 0
    for ele in username:
        if ele.lower() not in "abcdefghijklmnopqrstuvwxyz0123456789@._-+":
            return False
        if ele == "@":
            atCount += 1
    if atCount == 1:
        return True
    return False

def valid_pw(password):
    if pass_min <= len(password) <= pass_max:
        return True
    return False


# Main call
if __name__ == '__main__':
    app.run(debug=True)
