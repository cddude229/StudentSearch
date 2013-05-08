 # @param objects        List of JS objects that should be filtered
 # @param attr           The attribute list of the object to check against
 # @param grouping       As built by the Terminator.
import terminator

#print "inside filter"

def objectFilter(objects, attr, string):
  return filterObjects(objects, attr, terminator.terminator(string))

def filterObjects(objects, attr, grouping):
  #print "New grouping: " , grouping, " type: " , type(grouping)
  filteredObjects = [];
  if type(grouping) != type({}):
    #print "grouping is string"
    return [obj for obj in objects if grouping.lower() in map(lambda x: x.lower(), obj[attr])]
  elif len(grouping["items"])==0:
    #print "length is 0"
    return objects
  if grouping["type"] == "AND":
    #print "type is AND"
    newObjects = list(objects);
    for i in xrange(len(grouping["items"])):
      intersect = [val for val in newObjects if val in filterObjects(objects, attr, grouping["items"][i])]
      newObjects = list(intersect)
    return newObjects;
  elif grouping["type"] == "OR":
    #print "type is OR"
    for x in xrange(len(grouping["items"])):
      filteredObjects.extend(filterObjects(objects, attr, grouping["items"][x]))
    return filteredObjects
  return filteredObjects
