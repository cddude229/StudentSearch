// ENTER ALL DATA AT THE BOTTOM OF THE FILE
// NOT HERE

var majors = {};
var addMajor = function(number, name){
	majors[number] = {
		number: number,
		name: name
	};
    return number;
};

var courses = {};
var addCourse = function(id, list_of_numbers, real_name){
    if(typeof list_of_numbers != "object") list_of_numbers = [list_of_numbers];
    courses[id] = {
    	id: id,
    	list_of_numbers: list_of_numbers,
    	real_name: real_name
    };
    return id;
};

var skills = {};
var addSkill = function(id, name){
	skills[id] = {
		id: id,
		name: name
	};
	return id;
};

var students = [];
var addUser = function(first_name, last_name, class_year, major_id, course_list, skills_list, interests_list, image){
	var courses_ids = [];
	for(var a=0;a<course_list.length;a++){
		var course = courses[course_list[a]];
		courses_ids = courses_ids.concat(course.list_of_numbers);
	}

	var skills_ids = [];
	for(var a=0;a<skills_list.length;a++){
		skills_ids.push(skills[skills_list[a]].name);
	}

	students.push({
		id: students.length,
		first_name: first_name,
		last_name: last_name,
		class_year: class_year,
		major_id: major_id,
		course_list: course_list,
		courses_ids: courses_ids,
		skills_list: skills_list,
		skills_ids: skills_ids,
		interests_list: interests_list,
		image: image
	});
    return students.length - 1;
};

// ENTER DATA

// For Majors, get data from here: http://mitadmissions.org/discover/majors
addMajor("1", "Civil Engineering");
addMajor("2", "Mechanical Engineering");
addMajor("6-1", "Electrical Science and Engineering");
addMajor("6-2", "Electrical Engineering and Computer Science");
addMajor("6-3", "Computer Science and Engineering");
addMajor("11", "Urban Studies and Planning");
addMajor("15", "Management");
addMajor("18", "Mathematics");

// Courses
// IDs must be unique, BUT CAN BE STRINGS LIKE THE FULL CLASS NAME
addCourse(601,  "6.01", "Intro to EECS I");
addCourse(602,  "6.02", "Intro to EECS II");
addCourse(6813, ["6.813", "6.831"], "User Interface Design and Implementation");
addCourse(6831, ["6.831", "6.813"], "User Interface Design and Implementation");
addCourse(6005, "6.005", "Elements of Software Construction");
addCourse(11127, ["11.127", "11.252", "CMS.590"], "Computer Games and Simulations for Investigation and Education");
addCourse(11252, ["11.252", "11.127", "CMS.590"], "Computer Games and Simulations for Investigation and Education");
var CMS590 = "CMS590"; // quick fix for broken data set
addCourse(CMS590, ["CMS.590", "11.127", "11.252"], "Computer Games and Simulations for Investigation and Education");
addCourse(702, ["7.02"], "Something something biology");

// Skills
addSkill(0, "Python");
addSkill(1, "Java");
addSkill(2, "C++");
addSkill(3, "Algorithms");
addSkill(4, "Machine Learning");
addSkill(5, "MATLAB");
addSkill(6, "C");
addSkill(7, "HTML/CSS");

// Users
addUser(
    "Chris", // First name
    "Dessonville", // Last name
    2013, // Class year
    "6-3", // Major ID
    [601, 602, 6813, 702], // List of course IDs
    [0, 1, 2, 3, 7], // List of skill IDs
    ["Sudokus", "Video Games", "Problem Solving"], // List of interests
    "puppy.jpg" // Path to image in ./images folder.  Just create an image for now
);
addUser(
	"Tanya",
	"Liu",
	2013,
	"6-2",
	[601, 602, 6813],
	[0, 1, 2, 3, 5, 7],
	["Video Games", "Art", "Design", "Learning"],
	"puppy.jpg"
);
addUser(
	"Jessica",
	"Chen",
	2014,
	"6-3",
	[601, 602, 6813, 11127],
	[0, 1, 3, 7],
	["Education", "Communication", "Design"],
	"puppy.jpg"
);
addUser(
	"Sarah",
	"Scodel", 
	2013,
	"6-3",
	[601, 602, 6813],
	[0, 1, 2, 3],
	["Programming", "Algorithms"],
	"puppy.jpg"
);
addUser(
	"Bruce",
	"Wayne",
	2013,
	"6-3",
	[601, 602, 6813, 11127],
	[0,3,5],
	["Crime fighting", "Education", "UI Design", "Learning"],
	"batman.jpg"
);
addUser(
	"Diana",
	"Wonder",
	2014,
	"11",
	[601, 602, 6813, 11127],
	[0, 1, 2, 3, 5, 7],
	["Crime fighting", "Education", "UI Design", "Learning"],
	"wonderwoman.jpg"
);
addUser(
	"Ben",
	"BitDiddle",
	2015,
	"6-3",
	[601, 602],
	[0],
	["Programming", "Failing"],
	"puppy.jpg"
);
addUser(
	"Alyssa P.",
	"Hacker",
	2016,
	"6-3",
	[601, 602, 6813],
	[0, 1, 5, 7],
	["Correcting Ben", "Programming"],
	"puppy.jpg"
);
addUser(
	"Ash",
	"Ketchum",
	2015,
	"11",
	[601, 602, 6813, 11127],
	[0,3, 5],
	["Training", "Catching em all", "Education", "UI Design", "Learning"],
	"ash.jpg"
);
addUser(
	"Roy",
	"Mustang",
	2014,
	"6-2",
	[601, 602, 6813, CMS590],
	[0, 1, 2, 3, 5, 7],
	["Fire bending", "Education", "UI Design", "Learning"],
	"mustang.jpg"
);
addUser(
	"Chong-U",
	"Lim",
	2013,
	"6-3",
	[601, 602, 6813, 11127],
	[1, 2, 3, 4, 5, 6, 7],
	["Being awesome", "Education", "UI Design", "Learning"],
	"puppy.jpg"
);
addUser(
	"Roxie",
	"Wang",
	2013,
	"11",
	[601, 602, 6813, 11252],
	[0, 1, 2, 7],
	["Education", "UI Design", "Learning"],
	"puppy.jpg"
);
addUser(
	"Ryan",
	"Reynolds",
	2014,
	"6",
	[601,602,6813,6005,11127],
	[0,2,3,5],
	["Saving the world, Wearing spandex"],
	"puppy8.jpg"
);
addUser(
	"Ryan",
	"Gosling",
	2016,
	"6",
	[601,602,6813,11127],
	[0,1,2],
	["Talking to girls, Jumping on ferris wheels"],
	"puppy9.jpg"
);
addUser(
	"Hermione",
	"Granger",
	2016,
	"6-2",
	[601, 602, 6813, 11127],
	[1, 2, 3, 4, 5, 6, 7],
	["Magic", "Education", "UI Design", "Learning"],
	"hermione.jpg"
);
addUser(
	"Sherlock",
	"Holmes",
	2013,
	"6-3",
	[601, 602, 6813, 11127],
	[0, 1, 2, 5, 7],
	["Sudoku", "Solving Mysteries", "Education"],
	"sherlock.jpg"
);
addUser(
	"John",
	"Watson",
	2013,
	"11",
	[601, 602, 6813],
	[0, 1, 2, 3, 4],
	["Helping with cases", "Blogging"],
	"watson.jpg"
);
addUser(
	"Harry",
	"Potter",
	2016,
	"11",
	[601, 602, CMS590],
	[0, 1, 5, 7],
	["Magic", "Quidditch"],
	"potter.jpg"
);
addUser(
	"Ronald",
	"Weasley",
	2016,
	"6-3",
	[601, 602, 11127],
	[0, 1, 5, 7],
	["Magic", "Quidditch"],
	"ronweasley.jpg"
);
addUser(
	"Serena",
	"Moon",
	2014,
	"11",
	[11127],
	[0],
	["Falling"],
	"puppy2.jpg"
);
addUser(
	"Elena",
	"Gilbert",
	2013,
	"6",
	[601, 602, 6005, 6813, 11127],
	[0,2,5,7],
	["Spending time with brother, Eating"],
	"puppy3.jpg"
);
addUser(
	"Hugh",
	"Jackman",
	2015,
	"18",
	[601,602,6813,11127],
	[1,2,3,5,6],
	["Slicing things, Magic"],
	"puppy4.jpg"
);
addUser(
	"Billy",
	"Joel",
	2014,
	"11",
	[601, 11127],
	[1,2],
	["Singing, Dancing"],
	"puppy5.jpg"
);
addUser(
	"Selena",
	"Gomez",
	2016,
	"6",
	[601,602,6813],
	[1,2,3,5],
	["Singing, Being a princess"],
	"puppy6.jpg"
);
addUser(
	"Taylor",
	"Swift",
	2015,
	"11",
	[601,602,6813,11127],
	[1,2,5,7],
	["Singing, Meeting guys"],
	"puppy7.jpg"
);
addUser(
	"Damon",
	"Salvatore",
	2013,
	"15",
	[601,602,6813],
	[0,1,2],
	["Being mysterious"],
	"puppy10.jpg"
);
addUser(
	"Bella",
	"Swan",
	2013,
	"1",
	[601,6813,11127],
	[0,1,5,6],
	["Sleeping"],
	"puppy11.jpg"
);
