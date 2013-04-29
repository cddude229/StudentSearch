var majors = {};
var addMajor = function(number, name){
	majors[number] = {
		number: number,
		name: name
	};
};

var courses = [];
var addCourse = function(list_of_numbers, real_name){
    courses.push({
    	list_of_numbers: list_of_numbers,
    	real_name: real_name
    });
};

var skills = {};
var addSkill = function(id, name){
	skills[id] = {
		id: id,
		name: name
	};
};

var students = [];
var addUser = function(student){
	students.push(student);
};


// Load majors, courses, skills
$.ajax({
	url: "./get_data",
	dataType: "json",
	async: false,
	success: function(data){
		// Add majors
		for(var a=0;a<data.majors.length;a++){
			addMajor(data.majors[a]["id"], data.majors[a]["name"]);
		}

		// Add courses
		for(var a=0;a<data.courses.length;a++){
			addCourse(data.courses[a]["ids"], data.courses[a]["name"]);
		}

		// Add skills
		for(var a=0;a<data.skills.length;a++){
			addSkill(data.skills[a]["id"], data.skills[a]["name"]);
		}
	}
});

// Load students
$.ajax({
	url: "./get_students", // TODO: Change this to a blank search?
	dataType: "json",
	async: false,
	success: function(students){
		for(var a=0;a<students.length;a++){
			var s = students[a];
			addUser(s);
		}
	}
});
