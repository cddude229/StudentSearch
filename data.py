#
# Data entry is after the Data class.
#

class Data:
    students = []
    majors = []
    courses = []
    skills = []
    interests = []

    def addStudent(self, name, year, major_id, course_list, skills_list, interests_list, image):
        # validate the major exists
        if major_id not in set([i["id"] for i in self.majors]):
            raise Exception('You gave a major ID that doesn\'t exist: %s' % (major_id, ))

        # Validate that each of the courses exist
        all_courses = [",".join(i["ids"]) for i in self.courses]
        all_courses = ",".join(all_courses)
        all_courses = set(all_courses.split(","))
        for course in course_list:
            if course not in all_courses:
                raise Exception('You gave a course ID that doesn\'t exist: %s' % (course, ))

        # Validate that each of the skills exist
        all_skills = set([i["id"] for i in self.skills])
        for skill in skills_list:
            if skill not in all_skills:
                raise Exception('You gave a skill ID that doesn\'t exist: %d' % (skill, ))

        # Finally, add it
        self.students.append({
            "name": name,
            "year": year,
            "major_id": major_id,
            "course_list": self.makeUnique(course_list),
            "skills_list": self.makeUnique(skills_list),
            "interests_list": self.makeUnique(interests_list),
            "image": image
        })

    def addMajor(self, number, name):
        # validate the ID hasn't been used before
        list_of_used = set([i["id"] for i in self.majors])

        if number in list_of_used:
            raise Exception('You reused the major number: %s' % (number, ))

        # And add
        self.majors.append({
            "id": number,
            "name": name
        })

    def addCourse(self, list_of_numbers, real_name):
        if type(list_of_numbers) is str: # Might pass in a string as first param
            list_of_numbers = [list_of_numbers]

        # validate an ID hasn't been used before
        list_of_used = [",".join(i["ids"]) for i in self.courses]
        list_of_used = ",".join(list_of_used)
        list_of_used = set(list_of_used.split(","))

        for id in list_of_numbers:
            if id in list_of_used:
                raise Exception('You reused the course number: %s' % (id, ))

        # Ok, add it
        self.courses.append({
            "ids": self.makeUnique(list_of_numbers),
            "name": real_name
        })

    def addSkill(self, id, name):
        # validate the ID hasn't been used before
        list_of_used = set([i["id"] for i in self.skills])

        if id in list_of_used:
            raise Exception('You reused the skill ID: %d' % (id, ))

        # Now, add it
        self.skills.append({
            "id": id,
            "name": name
        })

    def makeUnique(self, li):
        return list(set(li))

data = Data()

#
# Data entry below here
#

data.addMajor("1", "Civil Engineering")
data.addMajor("2", "Mechanical Engineering")
data.addMajor("6", "Electrical Engineering and Computer Science")
data.addMajor("6-1", "Electrical Science and Engineering")
data.addMajor("6-2", "Electrical Engineering and Computer Science")
data.addMajor("6-3", "Computer Science and Engineering")
data.addMajor("11", "Urban Studies and Planning")
data.addMajor("15", "Management")
data.addMajor("18", "Mathematics")



# First param is either a string ID or a list of strings (all acceptable IDs)
data.addCourse("6.01", "Intro to EECS I")
data.addCourse("6.02", "Intro to EECS II")
data.addCourse(["6.813", "6.831"], "User Interface Design and Implementation")
data.addCourse("6.005", "Elements of Software Construction")
data.addCourse(["11.127", "11.252", "CMS.590"], "Computer Games and Simulations for Investigation and Education")



data.addSkill(0, "Python")
data.addSkill(1, "Java")
data.addSkill(2, "C++")
data.addSkill(3, "Algorithms")
data.addSkill(4, "Machine Learning")
data.addSkill(5, "MATLAB")
data.addSkill(6, "C")
data.addSkill(7, "HTML/CSS")



data.addStudent(
    "Chris Dessonville",
    2013,
    "6-3",
    [601, 602, 6813, 702],
    [0, 1, 2, 3, 7],
    ["Sudokus", "Video Games", "Problem Solving"],
    "puppy.jpg"
)
data.addStudent(
    "Tanya Liu",
    2013,
    "6-2",
    [601, 602, 6813],
    [0, 1, 2, 3, 5, 7],
    ["Video Games", "Art", "Design", "Learning"],
    "puppy2.jpg"
)
data.addStudent(
    "Jessica Chen",
    2014,
    "6-3",
    [601, 602, 6813, 11127],
    [0, 1, 3, 7],
    ["Education", "Communication", "Design"],
    "puppy10.jpg"
)
data.addStudent(
    "Sarah Scodel", 
    2013,
    "6-3",
    [601, 602, 6813],
    [0, 1, 2, 3],
    ["Programming", "Algorithms"],
    "puppy12.jpg"
)
data.addStudent(
    "Bruce Wayne",
    2013,
    "6-3",
    [601, 602, 6813, 11127],
    [0,3,5],
    ["Crime fighting", "Education", "UI Design", "Learning"],
    "batman.jpg"
)
data.addStudent(
    "Diana Wonder",
    2014,
    "11",
    [601, 602, 6813, 11127],
    [0, 1, 2, 3, 5, 7],
    ["Crime fighting", "Education", "UI Design", "Learning"],
    "wonderwoman.jpg"
)
data.addStudent(
    "Ben BitDiddle",
    2015,
    "6-3",
    [601, 602],
    [0],
    ["Programming", "Failing"],
    "puppy11.jpg"
)
data.addStudent(
    "Alyssa P. Hacker",
    2016,
    "6-3",
    [601, 602, 6813],
    [0, 1, 5, 7],
    ["Correcting Ben", "Programming"],
    "puppy5.jpg"
)
data.addStudent(
    "Ash Ketchum",
    2015,
    "11",
    [601, 602, 6813, 11127],
    [0,3, 5],
    ["Training", "Catching em all", "Education", "UI Design", "Learning"],
    "ash.jpg"
)
data.addStudent(
    "Roy Mustang",
    2014,
    "6-2",
    [601, 602, 6813, 11127],
    [0, 1, 2, 3, 5, 7],
    ["Fire bending", "Education", "UI Design", "Learning"],
    "mustang.jpg"
)
data.addStudent(
    "Chong-U Lim",
    2013,
    "6-3",
    [601, 602, 6813, 11127],
    [1, 2, 3, 4, 5, 6, 7],
    ["Being awesome", "Education", "UI Design", "Learning"],
    "puppy.jpg"
)
data.addStudent(
    "Roxie Wang",
    2013,
    "11",
    [601, 602, 6813, 11252],
    [0, 1, 2, 7],
    ["Education", "UI Design", "Learning"],
    "puppy.jpg"
)
data.addStudent(
    "Ryan Reynolds",
    2014,
    "6",
    [601,602,6813,6005,11127],
    [0,2,3,5],
    ["Saving the world, Wearing spandex"],
    "puppy8.jpg"
)
data.addStudent(
    "Ryan Gosling",
    2016,
    "6",
    [601,602,6813,11127],
    [0,1,2],
    ["Talking to girls, Jumping on ferris wheels"],
    "puppy9.jpg"
)
data.addStudent(
    "Hermione Granger",
    2016,
    "6-2",
    [601, 602, 6813, 11127],
    [1, 2, 3, 4, 5, 6, 7],
    ["Magic", "Education", "UI Design", "Learning"],
    "hermione.jpg"
)
data.addStudent(
    "Sherlock Holmes",
    2013,
    "6-3",
    [601, 602, 6813, 11127],
    [0, 1, 2, 5, 7],
    ["Sudoku", "Solving Mysteries", "Education"],
    "sherlock.jpg"
)
data.addStudent(
    "John Watson",
    2013,
    "11",
    [601, 602, 6813],
    [0, 1, 2, 3, 4],
    ["Helping with cases", "Blogging"],
    "watson.jpg"
)
data.addStudent(
    "Harry Potter",
    2016,
    "11",
    [601, 602, 11127],
    [0, 1, 5, 7],
    ["Magic", "Quidditch"],
    "potter.jpg"
)
data.addStudent(
    "Ronald Weasley",
    2016,
    "6-3",
    [601, 602, 11127],
    [0, 1, 5, 7],
    ["Magic", "Quidditch"],
    "ronweasley.jpg"
)
data.addStudent(
    "Serena Moon",
    2014,
    "11",
    [11127],
    [0],
    ["Falling"],
    "puppy2.jpg"
)
data.addStudent(
    "Elena Gilbert",
    2013,
    "6",
    [601, 602, 6005, 6813, 11127],
    [0,2,5,7],
    ["Spending time with brother, Eating"],
    "puppy3.jpg"
)
data.addStudent(
    "Hugh Jackman",
    2015,
    "18",
    [601,602,6813,11127],
    [1,2,3,5,6],
    ["Slicing things, Magic"],
    "puppy4.jpg"
)
data.addStudent(
    "Billy Joel",
    2014,
    "11",
    [601, 11127],
    [1,2],
    ["Singing, Dancing"],
    "puppy5.jpg"
)
data.addStudent(
    "Selena Gomez",
    2016,
    "6",
    [601,602,6813],
    [1,2,3,5],
    ["Singing, Being a princess"],
    "puppy6.jpg"
)
data.addStudent(
    "Taylor Swift",
    2015,
    "11",
    [601,602,6813,11127],
    [1,2,5,7],
    ["Singing, Meeting guys"],
    "puppy7.jpg"
)
data.addStudent(
    "Damon Salvatore",
    2013,
    "15",
    [601,602,6813],
    [0,1,2],
    ["Being mysterious"],
    "puppy10.jpg"
)
data.addStudent(
    "Bella Swan",
    2013,
    "1",
    [601,6813,11127],
    [0,1,5,6],
    ["Sleeping"],
    "puppy11.jpg"
)