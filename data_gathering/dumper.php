<?php


mysql_connect("localhost", "cddude_cddude229", "REDACTED");
mysql_select_db("cddude_813");

$res = mysql_query("SELECT * FROM students ORDER BY id ASC");

$skills = array();
function addSkill($id, $name){
    global $skills;
    $skills[strtolower($name)] = $id;
}
addSkill(0, "Python");
addSkill(1, "Java");
addSkill(2, "C++");
addSkill(3, "Algorithms");
addSkill(4, "Machine Learning");
addSkill(5, "MATLAB");
addSkill(6, "C");
addSkill(7, "HTML");
addSkill(8, "CSS");

function csvSplit($str){
    $str = trim($str);
    $str = preg_replace("/,\s+/", ",", $str);
    return array_filter(preg_split("/,/", $str));
}

$students = array();

// Ok, loop it
while($s = mysql_fetch_assoc($res)){
    // Handle classes
    $classes = csvSplit($s["classes"]);
    $classes = array_map('htmlentities', $classes);
    $s["classes"] = '"' . implode('", "', $classes) . '"';

    // Handle interests
    $interests = csvSplit($s["interests"]);
    $interests = array_map('htmlentities', $interests);
    $s["interests"] = '"' . implode('", "', $interests) . '"';

    // Handle skill
    $sk = csvSplit($s["skills"]);
    $sk = array_map('htmlentities', $sk);
    $ids = array();
    foreach($sk as $k => $v){
        $v2 = strtolower($v);
        if(isset($skills[$v2])){
            $ids[] = $skills[$v2];
        } else if($v != ""){
            $ids[] = count($skills);
            echo "data.addSkill(" . count($skills) . ", \"" . $v . "\");<br />";
            addSkill(count($skills), $v);
        }
    }
    $s["skills"] = implode(", ", $ids);

    $students[] = $s;
}

echo "<br /><br />";

foreach($students as $v){
    $space = "&nbsp;&nbsp;&nbsp;&nbsp;";
    echo "data.addStudent( // ID: " . $v["id"] . "<br />";
    echo $space;
    echo '"' . $v["username"] . '",<br />';
    echo $space;
    echo $v["class"] . ",<br />";
    echo $space;
    echo '"MISSING",<br />';
    echo $space;
    echo '[' . $v["classes"] . '],<br />';
    echo $space;
    echo '[' . $v["skills"] . '],<br />';
    echo $space;
    echo '[' . $v["interests"] . '],<br />';
    echo $space;
    echo '"' . $v["pic_type"] . '"<br />';
    echo ");<br />";
}