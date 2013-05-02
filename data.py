# -*- coding: cp1252 -*-
import os
#
# Data entry is after the Data class.
#

class Data:
    students = []
    majors = []
    courses = []
    skills = []
    skillsMap = {}

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

        # make sure the image specified exists
        if os.path.exists("static/images/students/" + image) == False:
            raise Exception("The image %s isn't in static/images/students/" % (image, ))

        # Build skills list real quick
        skills_ids = [self.skillsMap[i] for i in skills_list]

        # Finally, add it
        self.students.append({
            "id": len(self.students),
            "first_name": name.split(" ")[0],
            "last_name": " ".join(name.split(" ")[1:]),
            "class_year": year,
            "major_id": major_id,
            "course_list": self.makeUnique(course_list),
            "courses_ids": self.makeUnique(course_list),
            "skills_list": self.makeUnique(skills_list),
            "skills_ids": skills_ids,
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
        self.skillsMap[id] = name
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

# For Majors, get data from here: http://mitadmissions.org/discover/majors
data.addMajor("0", "Undeclared")
data.addMajor("1", "Civil Engineering")
data.addMajor("1E", "Environmental Engineering Science")
data.addMajor("2", "Mechanical Engineering")
data.addMajor("3", "Materials Science and Engineering")
data.addMajor("3C", "Archaeology and Materials")
data.addMajor("4", "Architecture")
data.addMajor("5", "Chemistry")
data.addMajor("6", "Electrical Engineering and Computer Science")
data.addMajor("6-1", "Electrical Science and Engineering")
data.addMajor("6-2", "Electrical Engineering and Computer Science")
data.addMajor("6-3", "Computer Science and Engineering")
data.addMajor("6-7", "Computer Science and Molecular Biology")
data.addMajor("7", "Biology")
data.addMajor("7A", "Biology")
data.addMajor("8", "Physics")
data.addMajor("9", "Brain and Cognitive Sciences")
data.addMajor("10", "Chemical Engineering")
data.addMajor("10B", "Chemical-Biological Engineering")
data.addMajor("11", "Urban Studies and Planning")
data.addMajor("12", "Earth, Atmospheric, and Planetary Sciences")
data.addMajor("14", "Economics")
data.addMajor("15", "Management")
data.addMajor("16", "Aerospace Engineering")
data.addMajor("16-1", "Aerospace Engineering")
data.addMajor("16-2", "Aerospace Engineering with Information Technology")
data.addMajor("17", "Political Science")
data.addMajor("18", "Mathematics")
data.addMajor("18C", "Mathematics with Computer Science")
data.addMajor("20", "Biological/Biomedical Engineering")
data.addMajor("21", "Humanities")
data.addMajor("21A", "Anthropology")
data.addMajor("21F", "Foreign Languages and Literatures")
data.addMajor("21H", "History")
data.addMajor("21M", "Music")
data.addMajor("21W", "Writing")
data.addMajor("22", "Nuclear Science and Engineering")
data.addMajor("24", "Philosophy/Linguistics")
data.addMajor("CMS", "Comparative Media Studies")
data.addMajor("STS", "Science, Technology and Society")
data.addMajor("WGS", "Women's and Gender Studies")



# First param is either a string ID or a list of strings (all acceptable IDs)
data.addCourse("1.00", "Introduction to Computers and Engineering Problem Solving")
data.addCourse("1.007", "EES-Lab: Engineering for Environment and Sustainability")
data.addCourse("1.016", "Design for Complex Environmental Issues: Building Solutions and Communicating Ideas")
data.addCourse("1.018", "Ecology I: The Earth System")
data.addCourse("1.020", "Ecology II: Engineering for Sustainability")
data.addCourse("1.050", "Engineering Mechanics I")
data.addCourse("1.060", "Engineering Mechanics II")
data.addCourse(["1.061", "1.61"], "Transport Processes in the Environment")
data.addCourse(["1.070", "12.320"], "Introduction to Hydrology")
data.addCourse("1.080", "Environmental Chemistry")
data.addCourse("1.083", "Environmental Health Engineering and Biology")
data.addCourse("1.101", "Introduction to Civil and Environmental Engineering Design I")
data.addCourse("1.102", "Introduction to Civil and Environmental Engineering Design II")
data.addCourse("1.106", "Environmental Fluid Transport Processes and Hydrology Laboratory")
data.addCourse("1.107", "Environmental Chemistry and Biology Laboratory")
data.addCourse("1.801", "Environmental Law, Policy, and Economics: Pollution Prevention and Control")
data.addCourse("2.00", "Introduction to Design")
data.addCourse("2.00B", "Toy Product Design")
data.addCourse("2.001", "Mechanics and Materials I")
data.addCourse("2.002", "Mechanics and Materials II")
data.addCourse(["2.003", "1.053"], "Dynamics and Control I")
data.addCourse("2.004", "Dynamics and Control II")
data.addCourse("2.005", "Thermal-Fluids Engineering I")
data.addCourse("2.006", "Thermal-Fluids Engineering II")
data.addCourse("2.007", "Design and Manufacturing I")
data.addCourse("2.008", "Design and Manufacturing II")
data.addCourse("2.009", "The Product Engineering Process")
data.addCourse("2.086", "Numerical Computation for Mechanical Engineers")
data.addCourse("2.670", "Mechanical Engineering Tools")
data.addCourse("2.671", "Measurement and Instrumentation")
data.addCourse("2.672", "Project Laboratory")
data.addCourse("2.678", "Electronics for Mechanical Systems")
data.addCourse("3.091", "Introduction to Solid-State Chemistry")
data.addCourse("3.094", "Materials in Human Experience")
data.addCourse(["3.985", "5.24", "12.011"], "Archaeological Science")
data.addCourse("3.986", "The Human Past: Introduction to Archaeology")
data.addCourse("4.110", "Design Across Scales, Disciplines and Problem Contexts")
data.addCourse("4.111", "Introduction to Architecture and Environmental Design")
data.addCourse("4.11A", "Introduction to Architecture and Environmental Design Intensive")
data.addCourse("4.112", "Architecture Design Fundamentals I")
data.addCourse("4.113", "Architecture Design Fundamentals II")
data.addCourse("4.401", "Introduction to Architectural Building Systems")
data.addCourse("4.440", "Building Structural Systems I")
data.addCourse(["4.447", "1.819"], "Building Structural Systems I")
data.addCourse("4.605", "A Global History of Architecture")
data.addCourse(["4.671", "4.670"], "Nationalism, Internationalism, and Globalism in Modern Art")
data.addCourse(["5.07" "20.507"], "Biological Chemistry I")
data.addCourse("5.111", "Principles of Chemical Science")
data.addCourse("5.112", "Principles of Chemical Science")
data.addCourse("5.12", "Organic Chemistry I")
data.addCourse("5.13", "Organic Chemistry II")
data.addCourse("5.310", "Laboratory Chemistry")
data.addCourse(["5.35", "5.35U"], "Introduction to Experimental Chemistry")
data.addCourse(["5.36", "5.36U"], "Biochemistry and Organic Laboratory")
data.addCourse("5.60", "Thermodynamics and Kinetics")
data.addCourse("6.00", "Introduction to Computer Science and Programming")
data.addCourse("6.01", "Intro to EECS I")
data.addCourse("6.02", "Intro to EECS II")
data.addCourse("6.S02", "Intro to EECS II from a Medical Technology Perspective") 
data.addCourse("6.002", "Circuits and Electronics")
data.addCourse("6.003", "Signals and Systems")
data.addCourse("6.004", "Computation Structures")
data.addCourse("6.005", "Elements of Software Construction")
data.addCourse("6.006", "Intro to Algorithms")
data.addCourse("6.007", "Electromagnetic Energy: From Motors to Lasers")
data.addCourse("6.011", "Introduction to Communication, Control, and Signal Processing")
data.addCourse("6.012", "Microelectronic Devices and Circuits")
data.addCourse("6.013", "Electromagnetics and Applications")
data.addCourse(["6.021", "2.791", "20.370"], "Cellular Biophysics and Neurophysiology")
data.addCourse("6.033", "Computer System Engineering")
data.addCourse("6.034", "Artificial Intelligence")
data.addCourse("6.035", "Computer Language Engineering")
data.addCourse("6.041", "Probabilistic Systems Analysis")
data.addCourse(["6.042", "18.062"], "Mathematics for Computer Science")
data.addCourse(["6.045", "18.400"], "Automata, Computability, and Complexity")
data.addCourse("6.046", "Design and Analysis of Algorithms")
data.addCourse("6.115", "Microcomputer Project Laboratory")
data.addCourse("6.141", "Robotics: Science and Systems I")
data.addCourse("6.163", "Strobe Project Laboratory")
data.addCourse("6.170", "Software Studio")
data.addCourse("6.172", "Performance Engineering of Software Systems")
data.addCourse("6.270", "Autonomous Robot Design Competition")
data.addCourse("6.803", "The Human Intelligence Enterprise")
data.addCourse(["6.804", "9.66"], "Computational Cognitive Science")
data.addCourse(["6.813", "6.831"], "User Interface Design and Implementation")
data.addCourse("6.824", "Distributed Computer Systems Engineering")
data.addCourse("6.829", "Computer Networks")
data.addCourse("6.837", "Intro to Graphics") 
data.addCourse(["6.854", "18.415"], "Advanced Algorithms")
data.addCourse(["6.856", "18.416"], "Randomized Algorithms")
data.addCourse("6.857", "Network and Computer Security")
data.addCourse("6.858", "Computer Systems Security")
data.addCourse(["6.863", "9.611"], "Natural Language and the Computer Representation of Knowledge")
data.addCourse("6.864", "Advanced Natural Language Processing")
data.addCourse("6.867", "Machine Learning")
data.addCourse("6.893", "Advanced Topics in Theoretical Computer Science")
data.addCourse("6.976", "The Founder's Journey")
data.addCourse("6.A48", "Physics of Energy")
data.addCourse("6.S064", "Introduction to Machine Learning")
data.addCourse("6.S078", "Computer Architecture: A Constructive Approach")
data.addCourse("6.S189", "Introduction to Python")
data.addCourse("6.UAT", "Preparation for Undergraduate Advanced Project")
data.addCourse(["7.012", "7.013", "7.014"], "Introductory Biology")
data.addCourse(["7.02", "10.702"], "Introduction to Experimental Biology and Communication")
data.addCourse("7.03", "Genetics")
data.addCourse("7.05", "General Biochemistry")
data.addCourse("7.06", "Cell Biology")
data.addCourse(["7.33", "6.049"], "Evolutionary Biology: Concepts, Models and Computation")
data.addCourse(["8.01", "8.01L", "8.012"], "Physics I")
data.addCourse(["8.02", "8.022"], "Physics II")
data.addCourse("8.03", "Physics III")
data.addCourse("8.033", "Relativity")
data.addCourse("8.04", "Quantum Physics I")
data.addCourse("8.044", "Statistical Physics I")
data.addCourse("8.05", "Quantum Physics II")
data.addCourse("8.06", "Quantum Physics III")
data.addCourse("8.07", "Electromagnetism II")
data.addCourse("8.08", "Statistical Physics II")
data.addCourse("8.09", "Classical Mechanics III")
data.addCourse("8.13", "Experimental Physics I")
data.addCourse("8.20", "Introduction to Special Relativity")
data.addCourse("8.223", "Classical Mechanics II")
data.addCourse("8.225", "Einstein, Oppenheimer, Feynman: Physics in the 20th Century")
data.addCourse(["8.282", "12.402"], "Introduction to Astronomy")
data.addCourse("8.286", "The Early Universe")
data.addCourse("9.00", "Introduction to Psychological Science")
data.addCourse("9.01", "Introduction to Neuroscience")
data.addCourse("9.20", "Animal Behavior")
data.addCourse(["9.48", "24.08"], "Philosophical Issues in Brain Science")
data.addCourse(["9.57", "24.945"], "Language Processing")
data.addCourse(["9.75", "WGS.228"], "Psychology of Gender and Race")
data.addCourse(["10.04", "24.114"], "A Philosophical History of Energy")
data.addCourse("10.10", "Introduction to Chemical Engineering")
data.addCourse("10.213", "Chemical and Biological Engineering Thermodynamics")
data.addCourse("10.27", "Energy Engineering Projects Laboratory")
data.addCourse("10.301", "Fluid Mechanics")
data.addCourse("10.302", "Transport Processes")
data.addCourse("10.37", "Chemical Kinetics and Reactor Design")
data.addCourse("10.450", "Process Dynamics, Operations, and Control")
data.addCourse(["11.127", "11.252", "CMS.590"], "Computer Games and Simulations for Investigation and Education")
data.addCourse("12.021", "Earth Science, Energy, and the Environment")
data.addCourse("14.01", "Principles of Microeconomics")
data.addCourse("14.02", "Principles of Macroeconomics")
data.addCourse("14.04", "Intermediate Microeconomic Theory")
data.addCourse("14.05", "Intermediate Macroeconomics")
data.addCourse("14.20", "Industrial Organization and Competitive Strategy")
data.addCourse("14.32", "Econometrics")
data.addCourse("14.73", "The Challenge of World Poverty")
data.addCourse("14.75", "Political Economy and Economic Development")
data.addCourse("15.053", "Optimization")
data.addCourse("15.075", "Statistical Thinking and Data Analysis")
data.addCourse("15.220", "Global Strategy and Organization")
data.addCourse("15.279", "Management Communication for Undergrads") 
data.addCourse("15.301", "Managerial Psychology")
data.addCourse("15.401", "Finance Theory I") 
data.addCourse("15.402", "Finance Theory II") 
data.addCourse("15.443", "Research Seminar in Finance")
data.addCourse(["15.501", "15.516"], "Corporate Financial Accounting")
data.addCourse("15.668", "People and Organizations")
data.addCourse("15.812", "Marketing Management")
data.addCourse("16.00", "Introduction to Aerospace and Design")
data.addCourse(["17.01", "24.04"], "Justice")
data.addCourse("17.021", "Philosophy of Law")
data.addCourse("17.03", "Introduction to Political Thought")
data.addCourse("17.552", "Political Economy of Chinese Reform")
data.addCourse(["18.01", "18.01A", "18.012"], "Calculus I")
data.addCourse(["18.02", "18.02A", "18.022"], "Calculus II")
data.addCourse("18.03", "Differential Equations")
data.addCourse("18.06", "Linear Algebra")
data.addCourse("18.100A", "Real Analysis")
data.addCourse("18.440", "Probability and Random Variables")
data.addCourse("18.443", "Statistics for Applications")
data.addCourse("18.781", "Theory of Numbers")
data.addCourse("20.109", "Laboratory Fundamentals in Biological Engineering")
data.addCourse(["20.110", "2.772"], "Thermodynamics of Biomolecular Systems")
data.addCourse(["20.310", "2.797", "3.053", "6.024"], "Molecular, Cellular, and Tissue Biomechanics")
data.addCourse("20.320", "Analysis of Biomolecular and Cellular Systems")
data.addCourse("20.330", "Fields, Forces and Flows in Biological Systems")
data.addCourse("21F.019", "Communicating Across Cultures")
data.addCourse("21F.043", "Introduction to Asian American Studies: Historical and Contemporary Issues")
data.addCourse("21F.075", "The Global Chinese: Chinese Migration, 1567-Present")
data.addCourse("21F.104", "Chinese IV (Regular)")
data.addCourse("21F.107", "Chinese I (Streamlined)")
data.addCourse("21F.108", "Chinese II (Streamlined)")
data.addCourse("21F.113", "Chinese V (Streamlined)") 
data.addCourse("21F.171", "Chinese I (Regular) - Globalization")
data.addCourse("21F.303", "French III")
data.addCourse("21F.304", "French IV")
data.addCourse("21F.308", "Writing (Like the) French")
data.addCourse("21F.501", "Japanese I")
data.addCourse("21F.502", "Japanese II")
data.addCourse("21F.701", "Spanish I")
data.addCourse("21F.702", "Spanish II")
data.addCourse("21F.703", "Spanish III")
data.addCourse("21F.704", "Spanish IV")
data.addCourse("21F.S03", "Special Subject: Foreign Languages and Literatures")
data.addCourse("21F.S04", "Special Subject: Foreign Languages and Literatures")
data.addCourse("21H.001", "How to Stage a Revolution")
data.addCourse("21H.142", "The Age of Reason: Europe in the 18th and the 19th Centuries")
data.addCourse("21H.238", "The Vikings")
data.addCourse("21H.385", "The Ghetto: From Venice to Harlem")
data.addCourse("21L.001", "Foundations of Western Literature: Homer to Dante")
data.addCourse("21L.003", "Reading Fiction")
data.addCourse("21L.011", "The Film Experience")
data.addCourse("21L.325", "Small Wonders")
data.addCourse("21L.430", "Popular Culture and Narrative")
data.addCourse("21L.706", "Studies in Film")
data.addCourse("21M.301", "Harmony and Counterpoint I")
data.addCourse("21M.302", "Harmony and Counterpoint II")
data.addCourse("21M.215", "Music of the Americas")
data.addCourse("21M.220", "Early Music")
data.addCourse("21M.421", "MIT Symphony")
data.addCourse("21M.445", "Chamber Music Society")
data.addCourse("21M.600", "Introduction to Acting")
data.addCourse("21M.605", "Voice and Speech for the Actor")
data.addCourse("21M.675", "Dance Theory and Composition")
data.addCourse("21M.880", "Dance Production")
data.addCourse("21W.022", "Writing and Experience: Reading and Writing Autobiography")
data.addCourse("21W.735", "Writing and Reading the Essay")
data.addCourse("21W.747", "Rhetoric")
data.addCourse("21W.758", "Genre Fiction Workshop")
data.addCourse("21W.785", "Communicating with Web-Based Media")
data.addCourse("21W.770", "Advanced Fiction Workshop")
data.addCourse("21W.778", "Science Journalism")
data.addCourse("21W.779", "Some Writing Subject?") # This can't be found on the registrar for some reason
data.addCourse("21W.789", "Communicating with Mobile Technology")
data.addCourse("22.012", "Seminar in Fusion and Plasma Physics")
data.addCourse("24.00", "Problems of Philosophy")
data.addCourse("24.02", "Moral Problems and the Good Life")
data.addCourse("24.09", "Minds and Machines")
data.addCourse("24.112", "Space, Time, and Relativity")
data.addCourse("24.120", "Moral Psychology")
data.addCourse("24.215", "Topics in the Philosophy of Science")
data.addCourse(["24.611", "17.000"], "Political Philosophy")
data.addCourse("24.900", "Introduction to Linguistics")
data.addCourse("EC.711", "D-Lab: Energy")
data.addCourse("MAS.110", "Fundamentals of Computational Media Design")
data.addCourse("SP.321", "Madness and Literature")
data.addCourse("STS.005", "Disease and Society in America")



data.addSkill(0, "Python")
data.addSkill(1, "Java")
data.addSkill(2, "C++")
data.addSkill(3, "Algorithms")
data.addSkill(4, "Machine Learning")
data.addSkill(5, "MATLAB")
data.addSkill(6, "C")
data.addSkill(7, "HTML")
data.addSkill(8, "CSS")
data.addSkill(9, "Hand and power tools");
data.addSkill(10, "bash");
data.addSkill(11, "Web development");
data.addSkill(12, "mobile development");
data.addSkill(13, "big data");
data.addSkill(14, "Spanish");
data.addSkill(15, "Microsoft Office");
data.addSkill(16, "KeyCreator");
data.addSkill(17, "AutoCAD");
data.addSkill(18, "Carpentry");
data.addSkill(19, "Solidworks");
data.addSkill(20, "Rhinocerous");
data.addSkill(21, "DesignBuilder");
data.addSkill(22, "French");
data.addSkill(23, "Programming");
data.addSkill(24, "lab skills");
data.addSkill(25, "near IR laser reading");
data.addSkill(26, "Lab Calculations");
data.addSkill(27, "PCR");
data.addSkill(28, "ELISA");
data.addSkill(29, "Biological Lab Techniques");
data.addSkill(30, "Django");
data.addSkill(31, "Javascript");
data.addSkill(32, "VBA");
data.addSkill(33, "JQuery");
data.addSkill(34, "UI");
data.addSkill(35, "UX");
data.addSkill(36, "Adobe Photoshop");
data.addSkill(37, "Adobe Illustrator");
data.addSkill(38, "Adobe Indesign");
data.addSkill(39, "FLUENT");
data.addSkill(40, "STAR-CCM+");
data.addSkill(41, "MathCad");
data.addSkill(42, "Autodesk Maya");
data.addSkill(43, "Paint Tool Sai");
data.addSkill(44, "Android");
data.addSkill(45, "scala");
data.addSkill(46, "R");
data.addSkill(47, "vi");
data.addSkill(48, "Computer Vision");
data.addSkill(49, "Excel");
data.addSkill(50, "Powerpoint");
data.addSkill(51, "epic doodling skillz");
data.addSkill(52, "Objective-C");
data.addSkill(53, "Ruby");
data.addSkill(54, "procrostination");
data.addSkill(55, "social engineering");
data.addSkill(56, "Ruby on Rails");
data.addSkill(57, ".NET");
data.addSkill(58, "HTML5");
data.addSkill(59, "CAD");
data.addSkill(60, "Inventor");
data.addSkill(61, "fabrication experience");
data.addSkill(62, "electrical design");
data.addSkill(63, "STATA");
data.addSkill(64, "Accounting");
data.addSkill(65, "Financial Valuation");
data.addSkill(66, "LaTeX");
data.addSkill(67, "biological and chemical lab techniques");
data.addSkill(68, "Perl");
data.addSkill(69, "Bio-lab skills");
data.addSkill(70, "mathematica");
data.addSkill(71, "TA experience");
data.addSkill(72, "extensive lab experience");
data.addSkill(73, "Data Analysis");
data.addSkill(74, "Error Analysis");
data.addSkill(75, "possum tackling");
data.addSkill(76, "C#");
data.addSkill(77, "Aspen");
data.addSkill(78, "Comsol");
data.addSkill(79, "Quantum Dots");
data.addSkill(80, "Mechanics");
data.addSkill(81, "CAD (Solidworks");
data.addSkill(82, "AutoCAD)");


##
##data.addStudent( # ID: 1
##    "Bria Wallace",
##    2016,
##    "0",
##    ["18.01", "18.02", "8.01L", "8.02", "7.012", "5.111", "21F.703", "21W.022"],
##    [0],
##    ["Working in a Lab Setting"],
##    "k1.jpg"
##)
##data.addStudent( # ID: 2
##    "Jhanel Chew",
##    2013,
##    "1",
##    ["8.01", "18.02", "5.111", "21W.735", "8.02", "1.016", "7.014", "21M.301", "21M.302", "1.050", "1.018", "1.101", "1.00", "1.102", "1.060", "1.020", "9.00", "1.070", "21M.220", "1.080", "1.083", "21M.215", "1.107", "1.061", "1.106", "5.12", "1.801"],
##    [9, 1, 5],
##    ["knitting", "crafting", "reading", "writing", "playing music"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 3
##    "Elizabeth Hong",
##    2014,
##    "6-3",
##    ["6.046", "6.005", "6.006", "6.01", "6.00", "7.33", "7.06", "7.05", "7.03"],
##    [1, 0, 10],
##    ["Epigenetics", "computational biology"],
##    "fh1.jpg"
##)
##data.addStudent( # ID: 4
##    "Angela Zhang",
##    2015,
##    "6-3",
##    ["6.005", "6.006", "6.170", "6.S078"],
##    [1, 0, 11, 12, 13],
##    ["photography", "big data", "analytics", "consumer products"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 5
##    "Marisol Clemens",
##    2015,
##    "20",
##    ["7.013", "8.01", "8.02", "7.05", "5.12", "18.02", "18.03", "6.00", "20.109", "20.110", "5.111"],
##    [14],
##    ["Photography", "Reading", "Writing"],
##    "fh2.jpg"
##)
##data.addStudent( # ID: 6
##    "Marisa Sotolongo",
##    2016,
##    "0",
##    ["18.02", "18.03", "8.012", "8.022", "8.282", "5.111", "7.013", "21H.142"],
##    [0],
##    ["physics", "human rights", "biophysics", "astronomy", "gender equality", "diversity"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 7
##    "Eann",
##    2015,
##    "6-3",
##    ["6.01", "6.004", "6.002", "14.01", "18.03", "18.01A", "18.02A", "5.111", "8.01", "8.02", "21W.022", "21F.703"],
##    [1, 0],
##    ["Problem Solving"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 8
##    "Jennifer Tilton",
##    2015,
##    "6-2",
##    ["6.00", "6.01", "6.02", "6.042", "6.003", "6.004", "6.005", "6.006", "8.02", "5.111", "7.013", "18.03", "21F.702", "21F.703", "24.09", "3.985", "21W.789"],
##    [1, 6, 2, 5, 0],
##    ["Puzzles", "Coding", "Graph Theory"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 9
##    "Julia Hogroian",
##    2016,
##    "0",
##    ["18.02", "8.01", "8.02", "3.091", "18.03", "7.012", "1.007"],
##    [5, 14, 15, 16, 17, 18],
##    ["Civil Engineering", "Transportation", "Volleyball"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 10
##    "Christiana Rosales",
##    2014,
##    "2",
##    ["18.01", "18.02", "18.03", "8.01L", "8.02", "14.01", "3.091", "7.012", "6.A48", "12.021", "10.04", "2.001", "2.003", "2.005", "2.007", "2.008", "2.671", "4.440", "4.401", "4.605", "4.671", "4.112", "4.11A", "4.447"],
##    [19, 20, 17, 21, 14, 22],
##    ["Travelling", "Cooking", "Reading", "Sustainability"],
##    "fh1.jpg"
##)
##data.addStudent( # ID: 11
##    "Jemale Lockett",
##    2014,
##    "6-2",
##    ["6.01", "6.005", "6.006", "6.042", "6.002", "6.004", "6.034", "6.02", "2.003", "8.01", "8.02", "7.013", "18.02", "18.03", "6.115", "6.UAT", "6.033"],
##    [1, 6, 2, 23, 5, 24],
##    ["microcontrollers", "embedded systems", "sports", "music", "problem solving", "comics"],
##    "mh1.jpg"
##)
##data.addStudent( #ID: 12
##    "Amanda Zhou",
##    2016,
##    "0",
##    ["18.022", "8.01", "5.112", "24.00", "18.03", "8.02", "6.01", "7.013", "21M.421"],
##    [1, 0, 25],
##    ["puzzles", "problem solving", "hands on activities"],
##    "k1.jpg"
##)
##data.addStudent( # ID: 13
##    "Parker Zhao",
##    2016,
##    "6-3",
##    ["18.03", "6.01", "21L.001", "8.02", "21L.325"],
##    [0],
##    ["Chess", "Running", "Puzzle solving", "languages"],
##    "mh2.jpg"
##)
##data.addStudent( # ID: 14
##    "Madeline Wharton",
##    2014,
##    "20",
##    ["18.02", "18.03", "7.013", "5.111", "20.110", "20.109", "20.320", "20.330", "20.310", "6.00", "7.03", "7.06", "7.05", "21L.003", "21L.706", "15.668", "5.12", "5.13", "9.00", "3.094", "8.01", "8.02", "9.48", "21L.430", "21M.600"],
##    [0, 26, 27, 28, 29],
##    ["Drug Delivery", "Pharmaceuticals", "Microscopy", "Puzzles", "Finance"],
##    "k2.jpg"
##)
##data.addStudent( # ID: 15
##    "Eunice Giarta",
##    2013,
##    "6-3",
##    ["8.01", "8.02", "18.03", "STS.005", "14.01", "14.02", "7.012", "5.111", "2.001", "9.00", "9.20", "9.57", "18.440", "18.443", "6.004", "6.005", "6.006", "6.01", "6.02", "6.033", "6.034", "6.042", "6.046", "6.803", "6.813", "6.804", "6.976", "15.401", "15.053", "15.443"],
##    [1, 0, 30, 31, 32, 5, 8, 33, 34, 35, 36, 37],
##    ["Brainteasers", "AI"],
##    "fh2.jpg"
##)
##data.addStudent( # ID: 16
##    "Rachel Wang",
##    2016,
##    "0",
##    ["7.012", "5.111", "8.012", "18.02", "18.03", "6.01", "2.00B", "21W.022", "8.02"],
##    [0, 36, 37, 38],
##    ["Philanthropy/service", "design", "event planning"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 17
##    "Theresa Santiano-McHatton",
##    2014,
##    "1",
##    ["18.01", "18.02", "18.03", "8.01", "8.02", "7.014", "5.111", "21W.779", "1.050", "1.061", "1.060", "1.080", "1.107", "1.101", "1.102", "1.018", "1.020"],
##    [5],
##    ["environment", "writing", "water", "pollution", "coral"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 18
##    "Taylor Farnham",
##    2014,
##    "2",
##    ["2.001", "2.002", "2.003", "2.004", "2.005", "2.006", "2.007", "2.008", "2.086", "2.671", "2.672", "3.091", "4.110", "6.007"],
##    [0, 5, 39, 40, 41],
##    ["Materials", "Mechanics", "Fluid dynamics", "Thermodynamics", "Manufacturing", "Machining", "Robotics", "Design", "Product Development", "Energy"],
##    "k3.jpg"
##)
##data.addStudent( # ID: 20
##    "Shannon Kao",
##    2015,
##    "6-7",
##    ["6.01", "6.S02", "6.005", "6.006", "6.004", "18.02", "7.013", "3.091", "MAS.110", "21W.770", "8.01", "8.02", "5.12"],
##    [1, 0, 36, 37, 38, 42, 43],
##    ["Storytelling/narrative", "game design", "algorithms", "graphics", "design", "education"],
##    "k4.jpg"
##)
##data.addStudent( # ID: 21
##    "Isra Shabir",
##    2013,
##    "6",
##    ["6.005", "6.006", "6.UAT", "6.00", "6.01"],
##    [1, 0, 7, 8, 31, 44],
##    ["Making mobile and web apps"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 22
##    "Victor J Wang",
##    2016,
##    "6-3",
##    ["6.01", "6.02", "6.004", "6.005", "6.006", "6.141", "6.034", "6.046", "6.042", "6.041", "6.033", "6.813", "6.867"],
##    [1, 2, 0, 34, 45, 46, 10, 47],
##    ["AI", "robotics", "machine learning"],
##    "mh3.jpg"
##)
##data.addStudent( # ID: 23
##    "Eddie Xue",
##    2014,
##    "6-3",
##    ["6.01", "6.02", "6.002", "6.004", "6.005", "6.006", "6.034", "6.042", "6.141", "6.033", "6.UAT", "18.02", "18.03", "18.06", "21F.107", "21F.108", "21F.075", "21F.043", "24.900", "21W.785", "14.01"],
##    [0, 1, 30, 7, 8, 31, 33],
##    ["Transportation", "Cities", "Vehicles", "Startups", "Boba"],
##    "k5.jpg"
##)
##data.addStudent( # ID: 24
##    "Michael Xu",
##    2015,
##    "6-3",
##    ["6.893", "6.856", "6.046", "6.034", "6.033", "6.006", "6.005", "6.004", "6.01", "18.781"],
##    [1, 2, 0, 31, 48],
##    ["Programming Competitions", "Project Euler", "Robots"],
##    "mh4.jpg"
##)
##data.addStudent( # ID: 25
##    "Carlos Domene",
##    2015,
##    "10",
##    ["5.112", "5.12", "5.310", "5.60", "7.012", "8.02", "10.10", "10.213", "10.301", "10.450", "18.02", "18.03", "21F.303", "21F.304", "21F.308", "21M.600"],
##    [1, 5, 49, 50, 22],
##    ["Systems modeling", "Fluid Mechanics", "Languages"],
##    "mh5.jpg"
##)
##data.addStudent( # ID: 26
##    "Steven Sullivan",
##    2015,
##    "2",
##    ["2.001", "2.002", "2.003", "2.005", "2.007", "2.670", "3.094", "5.111", "6.S189", "6.270", "7.012", "8.01", "8.02", "16.00", "18.02", "18.03", "21W.758", "21W.778"],
##    [19, 31, 36],
##    ["Product Design", "Fabrication", "Illustration"],
##    "mh6.jpg"
##)
##data.addStudent( # ID: 27
##    "Joy Chen",
##    2014,
##    "6-3",
##    ["6.02", "6.004", "6.005", "6.006", "6.046", "6.033", "6.864", "6.858", "6.867"],
##    [1, 2, 0, 51],
##    ["cats", "running", "fruit", "food"],
##    "k6.jpg"
##)
##data.addStudent( # ID: 28
##    "Micah Nishigaki",
##    2015,
##    "5",
##    ["9.00", "9.01", "18.01A", "18.02A", "7.013", "5.112", "8.01", "8.02", "24.900", "24.120", "21F.S03", "21F.S04", "5.12", "5.13", "5.310", "21F.501"],
##    [1, 0],
##    ["Being challenged", "discovering new things (especially/mostly in medicine)", "learning new things"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 29
##    "Edwin Zhang",
##    2014,
##    "6-3",
##    ["6.01", "6.002", "6.004", "6.005", "6.006", "6.034", "6.813", "18.440", "18.06"],
##    [1, 0, 52, 5],
##    ["Machine Learning", "Algorithms", "Mobile App Development"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 30
##    "Catherine Zuo",
##    2015,
##    "6-2",
##    ["6.01", "6.02", "6.003", "6.004", "6.005", "6.006", "6.045", "14.01", "14.02", "18.440"],
##    [1, 0],
##    ["Puzzles/Problem Solving", "Reading", "Writing", "Dance", "Taking walks/people-watching"],
##    "k7.jpg"
##)
##data.addStudent(# ID: 31
##    "Joshua Ma",
##    2014,
##    "6-3",
##    ["6.01", "6.02", "6.004", "6.005", "6.006", "6.046", "6.829", "6.824", "6.035", "6.172"],
##    [1, 2, 0, 53, 6, 31, 7, 8],
##    ["Swimming", "snowboarding"],
##    "mh1.jpg"
##)
##data.addStudent( # ID: 33
##    "Derek Vaughn",
##    2014,
##    "6-3",
##    ["6.813", "6.005", "6.004", "6.170", "6.006", "6.01", "6.02", "6.042"],
##    [1, 56, 57, 58, 33],
##    ["Algorithms", "AI", "Web Programming"],
##    "mh2.jpg"
##)
##data.addStudent( # ID: 34
##    "Matthew Hildner",
##    2015,
##    "2",
##    ["2.001", "2.003", "2.005", "2.006", "2.007", "2.678", "2.086", "8.01", "8.02", "18.01A", "18.02A", "7.012", "5.111", "3.986", "21H.001", "21H.385"],
##    [59, 19, 60, 5, 61, 62],
##    ["Design", "Robotics"],
##    "mh3.jpg"
##)
##data.addStudent( # ID: 35
##    "Judy Hao",
##    2013,
##    "15",
##    ["5.111", "18.02", "8.01", "9.00", "18.03", "5.12", "8.02", "SP.321", "5.13", "5.35", "5.36", "7.012", "STS.005", "7.02", "7.03", "7.05", "18.06", "14.01", "14.02", "14.04", "14.05", "15.075", "15.279", "15.301", "15.501", "21W.747", "21M.880", "21M.675", "21M.445", "1.00", "15.401", "17.552", "18.440", "14.20", "14.73", "15.443", "14.32", "15.402", "15.220", "14.75"],
##    [63, 1, 5, 49, 64, 65],
##    ["Finance", "Music"],
##    "k8.jpg"
##)
##data.addStudent( # ID: 37
##    "Brian Copeland",
##    2016,
##    "0",
##    ["5.111", "6.01", "7.012", "8.01", "8.022", "18.02", "18.03"],
##    [1, 0],
##    ["Puzzle-Solving (ie Rubik's Cubes- solving multi-layered problems)"],
##    "mh4.jpg"
##)
##data.addStudent( #ID: 38
##    "Richard Ni",
##    2015,
##    "6-3",
##    ["14.01", "24.00", "17.01", "17.021", "18.022", "7.012", "5.111", "6.01", "6.006", "6.042", "9.75", "9.00", "18.03", "6.005", "6.046", "6.004", "6.170", "21M.605"],
##    [1, 0, 66],
##    ["Problem Solving", "Following Sports", "Reddit"],
##    "mh5.jpg"
##)
##data.addStudent( # ID: 39
##    "Kangding Liu",
##    2013,
##    "10",
##    ["18.03", "18.06", "7.02", "7.03", "7.05", "7.06", "10.301", "10.302", "10.213", "10.37"],
##    [0, 5, 67],
##    ["dancing", "singing", "exploring"],
##    "k9.jpg"
##)
##data.addStudent( # ID: 40
##    "Eric Klinkhammer",
##    2015,
##    "20",
##    ["5.111", "5.12", "6.01", "6.004", "7.012", "7.03", "8.02", "18.02", "18.03", "20.110", "20.310", "20.109", "21F.104", "21F.501", "21F.502"],
##    [1, 6, 0, 68, 69],
##    ["Puzzles", "Synthetic Biology", "Fun things"],
##    "k10.jpg"
##)
##data.addStudent( # ID: 41
##    "Joe Hanley",
##    2016,
##    "0",
##    ["8.01", "8.02", "18.02", "18.03", "5.111", "7.012", "24.900", "6.01"],
##    [0],
##    ["Problem Solving"],
##    "puppy.jpg"
##)
##data.addStudent(# ID: 43
##    "Rhys Borchert",
##    2014,
##    "8",
##    ["8.01", "7.012", "18.02", "8.02", "3.091", "18.03", "24.04", "22.012", "8.286", "8.033", "8.03", "24.112", "8.223", "8.04", "8.044", "18.06", "24.02", "24.215", "8.09", "8.05", "8.07", "17.03", "8.13", "8.06", "18.100A", "24.611", "8.225"],
##    [70, 71, 72, 73, 74, 75],
##    ["physics", "theoretical physics", "particle physics", "cosmology", "moral philosophy", "political philosophy", "calculus", "philosophy of science", "history of philosophy", "history of science", "wearing dope suits"],
##    "mh6.jpg"
##)
##data.addStudent( # ID: 44
##    "Laith Maswadeh",
##    2015,
##    "2",
##    ["1.00", "2.001", "2.003", "2.005", "2.007", "2.670", "2.671", "5.112", "5.12", "7.013", "8.01", "8.022", "8.20", "8.223", "14.01", "14.02", "15.501", "16.00", "18.02", "18.03", "18.06", "21L.011", "10.04"],
##    [1, 0, 6, 15, 14],
##    ["Everything"],
##    "mh1.jpg"
##)
##data.addStudent( # ID: 45
##    "Lekha Kuhananthan",
##    2013,
##    "6-3",
##    ["6.01", "6.02", "6.002", "6.004", "6.005", "6.006", "6.012", "6.033", "6.034", "6.042", "6.046", "6.115", "6.172", "6.803", "6.854", "6.857", "6.UAT"],
##    [1, 0, 2, 6, 76],
##    ["Piano!", "Hayden", "Helping Chris"],
##    "fh1.jpg"
##)
##data.addStudent( # ID: 46
##    "Anvisha Pai",
##    2014,
##    "6-3",
##    ["6.813", "6.163", "6.S064", "6.011", "6.041", "6.02", "6.034", "6.046"],
##    [1, 0, 5, 31],
##    ["Technology", "Film"],
##    "k1.jpg"
##)
##data.addStudent( # ID: 47
##    "Chase Olle",
##    2013,
##    "2",
##    ["2.002", "2.004", "2.006", "2.086"],
##    [2, 1, 19, 59],
##    ["Building Things"],
##    "mh2.jpg"
##)
##data.addStudent( # ID: 48
##    "Ryan Friedrich",
##    2014,
##    "10",
##    ["10.37", "10.27", "21H.238", "EC.711"],
##    [5, 77, 78, 15, 79],
##    ["alternate energy", "fluid mechanics", "weight lifting", "pokémon"],
##    "puppy.jpg"
##)
##data.addStudent( # ID: 49 -- also got rid of a bunch of his classes.//lazy
##    "Grant Iwamoto",
##    2013,
##    "2",
##    ["18.02", "8.02", "5.111", "21F.501", "21F.502", "18.03", "7.014", "15.812", "14.01", "2.001", "2.003", "2.005","2.007", "2.002", "2.008", "24.00", "2.671", "15.668", "15.401", "2.009", "15.501"],
##    [80, 81, 82],
##    ["Structural Design", "Sports EquipmentTechnology", "Infrastructure"],
##    "mh3.jpg"
##)
data.addStudent(
    "Chris Dessonville",
    2013,
    "6-3",
    ["6.01", "6.02", "6.813"],
    [0, 1, 2, 3, 7],
    ["Sudokus", "Video Games", "Problem Solving"],
    "puppy.jpg"
)
data.addStudent(
    "Tanya Liu",
    2013,
    "6-2",
    ["6.01", "6.02", "6.813"],
    [0, 1, 2, 3, 5, 7],
    ["Video Games", "Art", "Design", "Learning"],
    "puppy2.jpg"
)
data.addStudent(
    "Jessica Chen",
    2014,
    "6-3",
    ["6.01", "6.02", "6.813", "11.127"],
    [0, 1, 3, 7],
    ["Education", "Communication", "Design"],
    "puppy10.jpg"
)
data.addStudent(
    "Sarah Scodel", 
    2013,
    "6-3",
    ["6.01", "6.02", "6.813"],
    [0, 1, 2, 3],
    ["Programming", "Algorithms"],
    "puppy12.jpg"
)
data.addStudent(
    "Bruce Wayne",
    2013,
    "6-3",
    ["6.01", "6.02", "6.813", "11.127"],
    [0,3,5],
    ["Crime fighting", "Education", "UI Design", "Learning"],
    "batman.jpg"
)
data.addStudent(
    "Diana Wonder",
    2014,
    "11",
    ["6.01", "6.02", "6.813", "11.127"],
    [0, 1, 2, 3, 5, 7],
    ["Crime fighting", "Education", "UI Design", "Learning"],
    "wonderwoman.jpg"
)
data.addStudent(
    "Ben BitDiddle",
    2015,
    "6-3",
    ["6.01", "6.02"],
    [0],
    ["Programming", "Failing"],
    "puppy11.jpg"
)
data.addStudent(
    "Alyssa P. Hacker",
    2016,
    "6-3",
    ["6.01", "6.02", "6.813"],
    [0, 1, 5, 7],
    ["Correcting Ben", "Programming"],
    "puppy5.jpg"
)
data.addStudent(
    "Ash Ketchum",
    2015,
    "11",
    ["6.01", "6.02", "6.813", "11.127"],
    [0,3, 5],
    ["Training", "Catching em all", "Education", "UI Design", "Learning"],
    "ash.jpg"
)
data.addStudent(
    "Roy Mustang",
    2014,
    "6-2",
    ["6.01", "6.02", "6.813", "11.127"],
    [0, 1, 2, 3, 5, 7],
    ["Fire bending", "Education", "UI Design", "Learning"],
    "mustang.jpg"
)
data.addStudent(
    "Chong-U Lim",
    2013,
    "6-3",
    ["6.01", "6.02", "6.813", "11.127"],
    [1, 2, 3, 4, 5, 6, 7],
    ["Being awesome", "Education", "UI Design", "Learning"],
    "puppy.jpg"
)
data.addStudent(
    "Roxie Wang",
    2013,
    "11",
    ["6.01", "6.02", "6.813", "11.252"],
    [0, 1, 2, 7],
    ["Education", "UI Design", "Learning"],
    "puppy.jpg"
)
data.addStudent(
    "Ryan Reynolds",
    2014,
    "6",
    ["6.01","6.02","6.813","6.005","11.127"],
    [0,2,3,5],
    ["Saving the world, Wearing spandex"],
    "puppy8.jpg"
)
data.addStudent(
    "Ryan Gosling",
    2016,
    "6",
    ["6.01","6.02","6.813","11.127"],
    [0,1,2],
    ["Talking to girls, Jumping on ferris wheels"],
    "puppy9.jpg"
)
data.addStudent(
    "Hermione Granger",
    2016,
    "6-2",
    ["6.01", "6.02", "6.813", "11.127"],
    [1, 2, 3, 4, 5, 6, 7],
    ["Magic", "Education", "UI Design", "Learning"],
    "hermione.jpg"
)
data.addStudent(
    "Sherlock Holmes",
    2013,
    "6-3",
    ["6.01", "6.02", "6.813", "11.127"],
    [0, 1, 2, 5, 7],
    ["Sudoku", "Solving Mysteries", "Education"],
    "sherlock.jpg"
)
data.addStudent(
    "John Watson",
    2013,
    "11",
    ["6.01", "6.02", "6.813"],
    [0, 1, 2, 3, 4],
    ["Helping with cases", "Blogging"],
    "watson.jpg"
)
data.addStudent(
    "Harry Potter",
    2016,
    "11",
    ["6.01", "6.02", "11.127"],
    [0, 1, 5, 7],
    ["Magic", "Quidditch"],
    "potter.jpg"
)
data.addStudent(
    "Ronald Weasley",
    2016,
    "6-3",
    ["6.01", "6.02", "11.127"],
    [0, 1, 5, 7],
    ["Magic", "Quidditch"],
    "ronweasley.jpg"
)
data.addStudent(
    "Serena Moon",
    2014,
    "11",
    ["11.127"],
    [0],
    ["Falling"],
    "puppy2.jpg"
)
data.addStudent(
    "Elena Gilbert",
    2013,
    "6",
    ["6.01", "6.02", "6.005", "6.813", "11.127"],
    [0,2,5,7],
    ["Spending time with brother, Eating"],
    "puppy3.jpg"
)
data.addStudent(
    "Hugh Jackman",
    2015,
    "18",
    ["6.01","6.02","6.813","11.127"],
    [1,2,3,5,6],
    ["Slicing things, Magic"],
    "puppy4.jpg"
)
data.addStudent(
    "Billy Joel",
    2014,
    "11",
    ["6.01", "11.127"],
    [1,2],
    ["Singing, Dancing"],
    "puppy5.jpg"
)
data.addStudent(
    "Selena Gomez",
    2016,
    "6",
    ["6.01","6.02","6.813"],
    [1,2,3,5],
    ["Singing, Being a princess"],
    "puppy6.jpg"
)
data.addStudent(
    "Taylor Swift",
    2015,
    "11",
    ["6.01","6.02","6.813","11.127"],
    [1,2,5,7],
    ["Singing, Meeting guys"],
    "puppy7.jpg"
)
data.addStudent(
    "Damon Salvatore",
    2013,
    "15",
    ["6.01","6.02","6.813"],
    [0,1,2],
    ["Being mysterious"],
    "puppy10.jpg"
)
data.addStudent(
    "Bella Swan",
    2013,
    "1",
    ["6.01","6.813","11.127"],
    [0,1,5,6],
    ["Sleeping"],
    "puppy11.jpg"
)

