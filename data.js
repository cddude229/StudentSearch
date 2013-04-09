// ENTER ALL DATA AT THE BOTTOM OF THE FILE
// NOT HERE

var addMajor = function(number, name){
    return number;
};

var addCourse = function(id, list_of_numbers, real_name){
    if(typeof list_of_numbers != "object") list_of_numbers = [list_of_numbers];
    return id;
};

var addSkill = function(id, name){
     return id;
};

var addUser = function(first_name, last_name, class_year, major_id, course_list, skills_list, interests_list, image){
    return 0;
};

// ENTER DATA

// For Majors, get data from here: http://mitadmissions.org/discover/majors
addMajor("6-1", "Electrical Science and Engineering");
addMajor("6-2", "Electrical Engineering and Computer Science");
addMajor("6-3", "Computer Science and Engineering");

// Courses
// IDs must be unique, BUT CAN BE STRINGS LIKE THE FULL CLASS NAME
addCourse(601,  "6.01", "Intro to EECS I");
addCourse(602,  "6.02", "Intro to EECS II");
addCourse(6813, ["6.813", "6.831"], "User Interface Design and Implementation");

// Skills
addSkill(0, "Python");
addSkill(1, "Java");
addSkill(2, "C++");
addSkill(3, "Algorithms");

// Users
addUser(
    "Chris", // First name
    "Dessonville", // Last name
    2013, // Class year
    "6-3", // Major ID
    [601, 602, 6813], // List of course IDs
    [0, 1, 2, 3], // List of skill IDs
    ["Sudokus", "Video Games", "Problem Solving"], // List of interests
    "puppy.jpg" // Path to image in ./images folder.  Just create an image for now
);