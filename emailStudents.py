import shelve

def addStudents(professor, listOfStudents):
  # listOfStudents should be IDs only
  d = shelve.open("emails")
  if d.has_key(professor):
    d[professor] = d[professor]+filter(lambda x:x not in d[professor],listOfStudents)
  else:
    d[professor] = listOfStudents
  d.close()

def getStudents(professor):
  d = shelve.open("emails")
  if d.has_key(professor):
    return d[professor]
  else:
    return []
