 # @param objects        List of JS objects that should be filtered
 # @param attr           The attribute list of the object to check against
 # @param grouping       As built by the Terminator.

def objectFilter(objects, attr, grouping):
  filteredObjects = [];
  if type(grouping) == 'string':
    return [obj for obj in objects if grouping.lower() in obj[attr]]
  elif len(grouping["items"])==0:
    return objects
  if grouping["type"] == "AND":
    newObjects = list(objects);
    for i in range(len(grouping["items"])):
      intersect = [val for val in newObjects if val in objectFilter(objects, attr, grouping["items"][i])]
      newObjects = list(intersect)
    return newObjects;
  elif grouping["type"] == "OR":
    for x in range(len(grouping["items"])):
      filteredObjects= list(set(filteredObjects) | set(objectFilter(objects, attr, grouping["items"][x])))
    return filteredObjects
