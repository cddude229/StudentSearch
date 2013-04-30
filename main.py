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
    # login page requires email and password
    if (is_loggedin):
        return render_template('./index.html')
    return render_template('./login.html') # returns to login if not logged in


@app.route('/get_students')
def get_students():
    if (is_loggedin == False):
        return render_template('./login.html')

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
    if (is_loggedin == False):
        return render_template('./login.html')

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
    if (is_loggedin == False):
        return render_template('./login.html')

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
    if (is_loggedin == False):
        return render_template('./login.html')

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

    # Iterate over students; remove students whose ID is in hidden students
    # Then, add their ID to "hidden students that match"
    if len(hiddenStudents) > 0:
        hiddenStudentsThatMatch = [s["id"] for s in students if str(s["id"]) in hiddenStudents]
        students = [s for s in students if str(s["id"]) not in hiddenStudents]
            

    # Only show the students whose years are in shownYears
    students = [s for s in students if str(s["class_year"]) in shownYears]
            

    # Ok, now sort the sutdents by searchOrder!
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
    print "logging in"
    if (is_loggedin):
        session['error'] = 'You are already logged in!'
        return render_template('./index.html')
    
    if request.method == 'GET':
        return render_template('./login.html')
		
    else: 
        # get username and pw from form
        uname = str(request.form.USERNAMEBOXID) #fill this in!!!!!!!!!!!!!!!!!!!!
        inputpw = str(request.form.PWBOXID)
		# check if uname and pw are valid things
        if (valid_uname(uname) == False or valid_pw(inputpw) == False):
            session["error"] = "Your username or password is invalid."
            return render_template('./login.html')

        valid = check_database(uname, inputpw)
		
		# if no, login again
        if valid == false:
            session["error"] = "Either you are not a registered user or your username and password do not match. Please try again."
            return render_template('./login.html')
		# if yes, login (set session user to username)
        session["username"] = uname
        return render_template('./index.html')


@app.route('/register', methods=['POST', 'GET'])
def runRegister():
    # @Tanya: Your code will go here to create a registration
    # 1) If get, return register.html
    # 2) If post, validate the login credentials (Check if pws match, if emails been used before, if email has @, .)
    # 3) If login credentials are invalid, return register.html with an error message
    # 4) If login credentials are valid, direct to index.html (also add to shelve database
    if (is_loggedin):
        session["error"] = 'You are already logged in!'
        return render_template('./index.html')
    if request.method == 'GET':
        return render_template('./register.html')
    else:
        uname = str(request.form.uname_box) #@Chris - make id tags in html
        pw1 = str(request.form.pw_box)
        pw2 = str(request.form.pw_confirm_box)

        if pw1 != pw2:
            session["error"] = "Your passwords do not match"
            return render_template('./register.html')
		
        if (valid_uname(uname) == False or valid_pw(pw1) == False):
            session["error"] = "Your username or password is invalid."
            return render_template('./register.html')
			
        if check_database(uname):
            session["error"] = "That username is already in use."
            return render_template('./register.html')

        dict = shelve.open("users")
        dict[uname] = hashlib.sha256(pw1).hexdigest()
        dict.close()
        return render_template('./login.html')


@app.route('/logout', methods=['GET'])
def runLogout():
    # @Tanya: Log them out and return to the login page
    if (is_loggedin):
        del session["username"] # does this work?
    return render_template('./login.html')


@app.route('/get_data')
def getData():
    if (is_loggedin == False):
        return render_template('./login.html')

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
    if (is_loggedin == False):
        return render_template('./login.html')
    return str(session["username"])
	
# Tanya's helper methods 
def is_loggedin():
    if "username" in session:
        return True
    return False 
	
def check_database(username, password = False):
    valid_entry = False
    dict = shelve.open("users") # Dictionary of username and hashedpw.hexdigest()
    hashed_inputpw = hashlib.sha256(password).hexdigest()
    if dict.has_key(username):
        if (password == False or hashed_inputpw == dict[username]):
            valid_entry = True
    dict.close()
    return valid_entry
	
def valid_uname(username):
    if len(username) < 1:
        return False
    if len(username) > 16:
        return False
    for ele in username:
        if ele.lower() not in "abcdefghijklmnopqrstuvwxyz_0123456789":
            return False
    return True

def valid_pw(password):
    if 6 < len(password) < 35:
        return False
    return True


# Main call
if __name__ == '__main__':
    app.run(debug=True)
