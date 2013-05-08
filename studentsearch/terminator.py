import string

# When given a good search string, this will return a list of groupings to use.
def terminator(str):
    # State
    currentItems = []
    unparsedTerms = []# Used for groupings only
    groupDepth = 0
    currentTerm = ""
    lastType = "AND"#Default to AND.  Only case where this is used if it's only one item

    for a in range(len(str)):
        ch = str[a]
        if ch == "(":
            groupDepth+=1
            currentTerm += ch
        elif ch == ")":
            groupDepth-=1
            currentTerm += ch
            # Ok, recursively pass down
            if groupDepth == 0:
                unparsedTerms.append(currentTerm);
                combined = string.join(unparsedTerms," ")
                index0 = string.find(combined,"(")
                index1 = string.rfind(combined,")")
                combined = combined[:index1] + combined[index1+1:]
                combined = combined[:index0] + combined[index0+1:]
                toAppend = terminator(combined)
                if toAppend!="":
                    currentItems.append(toAppend)
                unparsedTerms = [] # Reset unparsed terms
                currentTerm = "" # Clear term
                a+=1 # Skip the next space
            
        elif ch == " ":
            if groupDepth == 0:
                #Ok, not in parenthesis and hit a gap.
                # See if it was an AND or OR, and record it
                if (currentTerm == "AND" or currentTerm == "OR"):
                    lastType = currentTerm
                else:
                    if currentTerm!="":
                        currentItems.append(currentTerm)
            else:
                if currentTerm!="":
                    unparsedTerms.append(currentTerm)
            #ok, finally add last term
            currentTerm = ""
        else:
            currentTerm += ch
        
    # Add last item, if there
    if len(currentTerm) > 0:
        currentItems.append(currentTerm)
    # return our result
    return {"type" : lastType, "items" : currentItems}
    
#print terminator("(6.813 AND 6.860) OR python")
