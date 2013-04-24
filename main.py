from flask import Flask, jsonify, request, session, render_template, redirect, url_for
import base64
import shelve
import os
import json
import data

app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


@app.route('/', methods=['GET', 'POST'])
def index():
   return render_template('./index.html')

def getDataFile():
   if os.path.exists("data.json"):
      fo = open("data.json", "r")
   else:
      fo = open("data.json", "r") 
   return fo

#get the contents of a particular sticky
@app.route('/get_students')
def get_contents():
    students = getDataFile()
    studentData = students.read();
    students.close()
    studentJson = json.loads(studentData)
    return jsonify(result = studentJson)


@app.route('/search', methods=['POST'])
def runSearch():
    pass


@app.route('/get_data')
def getData():
    # Get all data except students
    pass

if __name__ == '__main__':
    app.run(debug=True)
