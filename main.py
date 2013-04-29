from flask import Flask, jsonify, request, session, render_template, redirect, url_for
import base64
import shelve
import os
import json
from data import data

app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


@app.route('/', methods=['GET', 'POST'])
def index():
    # @Tanya: Make this show index.html if logged in
    return render_template('./index.html')

@app.route('/get_students')
def get_contents():
    # DON'T TOUCH
    # Frontend relies on this format!
    return json.dumps(data.students)


@app.route('/search', methods=['POST'])
def runSearch():
    # @jess: Filter hidden students here
    # @jess: Filter here
    # @jess: Sort here
    pass

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
