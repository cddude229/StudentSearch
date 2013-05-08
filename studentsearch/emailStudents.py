import shelve

def addStudents(professor, listOfStudents):
  # listOfStudents is array of dictionaries with studentID as key and time as value
  d = shelve.open("emails")
  if d.has_key(professor):
    newIDs = [s["id"] for s in listOfStudents]
    d[professor] = filter(lambda x: x["id"] not in newIDs, d[professor]) + listOfStudents
  else:
    d[professor] = listOfStudents
  d.close()

def getStudents(professor):
  d = shelve.open("emails")
  if d.has_key(professor):
    return d[professor]
  else:
    return []
