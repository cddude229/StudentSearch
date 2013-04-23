<?php

if(isset($_POST["username"])){
    mysql_connect("localhost", "cddude_cddude229", "REDACTED");
    mysql_select_db("cddude_813");

    function f($s){
        $str = $_POST[$s];
        if(strlen($str) > 10000) die("String over 10k characters. Don't fuck with me.");
        if(strlen($str) == 0) die("Empty string. die die die");

        return mysql_real_escape_string($str);
    }

    $username = f("username");
    $class = f("class");
    $classes = f("classes");
    $skills = f("skills");
    $interests = f("interests");
    $pic_type = f("pic_type");

    mysql_query("
        INSERT INTO
            `students`
        (`username`, `class`, `classes`, `skills`, `interests`, `pic_type`)
        VALUES
        ('$username', '$class', '$classes', '$skills', '$interests', '$pic_type')
    ");

    die("Thanks for helping!");
}

?>

<html>
<head>
    <title>StudentSearch Data Gathering</title>
</head>
<body>
    Our project lets professors search for students for UROPs or TA spots.  While entering data, please keep that in mind.  Thanks!

    <br /><br />
    <form action="?" method="post" id="tehform">
        Your name:
        <br />
        <input type="text" name="username" placeholder="Elvis Presley" />
        <br /><br />

        Class year: (Only the 4-digit year please)
        <br />
        <input type="text" name="class" placeholder="i.e. 2013" />
        <br /><br />

        MIT Classes You've Taken: (by course number, comma separated please)
        <br />
        <input type="text" name="classes" placeholder="6.813, 6.005, 6.01" size="200" />
        <br /><br />

        Skills You Have: (comma separated please, be as general or specific as you like)
        <br />
        <input type="text" name="skills" placeholder="Java, C++, Programming, UI, UX" size="200" />
        <br /><br />

        Interests You Have: (comma separated please; keep in mind these would show to UROPs)
        <br />
        <input type="text" name="interests" placeholder="Puzzles, Problem Solving, Mystery Solving" size="200" />
        <br /><br />

        Picture Type You Want: (We'll show this type of picture as your profile pic)
        <br />
        <select name="pic_type">
            <option value="puppy">Puppy</option>
            <option value="kitten">Kitten</option>
            <option value="superhero">Super Hero</option>
        </select>
        <br /><br />

        <input type="submit" value="Submit Data" name="submitit" />
    </form>

    <br /><br />
    Note: You will not receive any e-mails from our program.  Your information is just to help us simulate a real environment!

    <script type="text/javascript">
    var f = document.forms.tehform;
    f.onsubmit = function(){
        // Get over the fact I didn't use an event listener.  I'm cheap. :P
        var l = function(a){ return f[a].value.length > 0; };
        var ret = l("username") && l("class") && l("classes") && l("skills") && l("interests");
        if(ret === false){
            alert("Please make sure to fill in the entire form.");
        } else {
            f.submitit.disabled = true; // don't double submit
        }

        return ret;
    };
    f.submitit.disabled = false; // Reload fix
    </script>
</body>
</html>