<!--Search Widget
Michael Ge, 2015
    
Doors Embed doors with an iframe linking to index.php with a width and height. 
Include teststyles.css as css file for appropriate resizing.-->

<?php require(__DIR__ . "/../../../lib/functions.php"); ?>
<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="title" content="CS50 Indoors" />
        <meta name="description" content="Use binary and linear search to find the number!" />
        <link rel="image_src" href="<?= img_encode("img/indoors-thumb.png"); ?>"/>
        
        <?php
            $styles = [
                "css/bootstrap.min.css",
                "css/bootstrap-toggle.css",
                "css/jquery.qtip.css",
                "css/bootstrap-dialog.css",
            ];
            foreach ($styles as $style) {
                print("\n<style>\n");
                print(file_get_contents($style));
                print("\n</style>\n");
            }
        ?>
    
            <style>
            /* Search Widget
               Michael Ge, 2015 */
            
            /* Sets font type to Gotham */
            @font-face {
                font-family: code;
                src: url(../fonts/Gotham-Book.otf);
            }
            
            /* Sets overall font, size, and blocks user highlighting/dragging */
            .container {    
                font-family: code, sans-serif;
                width: 100%;
                cursor: default;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            /*Text style*/
            .text {
                font-family: code, sans-serif;
                text-align: center;
                -webkit-font-smoothing: antialiased;
                color: black;
            
            }
            
            .labels:hover {
                cursor: pointer;
            }
            
            .index:hover,.door:hover {
                cursor: grab;
                cursor: -moz-grab;
                cursor: -webkit-grab;
            }
            
            .images {
                text-align: center;
                margin-bottom: 1%;
                margin-left: -10%;
                margin-right: -10%;
            }
            
            .room, .door {
                position: relative;
                display: inline-block;
                text-align: center;
                z-index: 1;
            }
            
            .room {
                margin-left: 0.7vw;
                margin-right: 0.7vw;
            }
            
            img {
                width: 4vw;
                height: auto;
            }
            
            .handle {
                cursor: grabbing;
                cursor: -moz-grabbing;
                cursor: -webkit-grabbing;
                display: block;
                width: 2vw;
                position: absolute;
                left: 2.3vw;
                top: 5.7vw;
                z-index: 2;
            }
            
            .number {
                position: absolute;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                top: 4.4vw;
                font-size: 2vw;
                z-index: 0;
            }
            
            .index {
                position: relative;
                top: 3.3vw;
                margin: 0 auto;
                font-size: 1.6vw;
                visibility: visible;
            }
            
            #gameText {
                margin-bottom: 0;
                font-size: 2vw;
                visibility: hidden;
            }
            
            #footer {
                margin: 1vw;
                margin-top: 1vw;
                font-size: 1.2vw;
            }
            
            ul {
                list-style: none;
                padding: 0;
                margin-top: 0;
                margin-bottom: 0;
            }
            
            li {
                margin: 0 auto;
                display: inline-block;
                text-align: center;
            }
            
            .labels {
                font-size: 20px;
                margin: 0 auto;
                box-sizing: bounding-box;
            }
            
            .toggle-group { 
                transition: none; 
                -webkit-transition: none;
                -moz-transition: none;
            }
            
            .button {
                display: inline;
                text-align: center;
            }
            
            #labelDiv, #oDiv, #sortDiv {
                text-align: center;
            }
            
            #labelDiv2, #oDiv2, #sortDiv2 {
                width: 25%;
            }
            
            #playButton {
                margin: 2%;
            }
            
            #oDiv .toggle-off.active {
                box-shadow: none;
                color: white;
                background-color: #428bca;
            }
            
            #oDiv .toggle-off.active:hover {
                background-color: #1170ab;
            }
            
            .importantRule { 
                cursor: not-allowed !important; 
                cursor: -moz-not-allowed !important; 
                cursor: -webkit-not-allowed !important;
            }
        </style>
        
        <?php
            $scripts = [
                "js/jquery.js",
                "js/jquery.qtip.js",
                "js/bootstrap.min.js",
                "js/bootstrap-toggle.js",
                "js/bootstrap-dialog.js"
            ];
            foreach ($scripts as $script) {
                print("\n<script>\n");
                print(file_get_contents($script));
                print("\n</script>\n");
            }
        ?>
    
        <script>
            /* Search Widget
             * Michael Ge, 2015 */
            
            // Number of doors 
            var DOORS = 15;
            // Length of celebration or loss
            var OPEN_TIME = 2000;
            // Celebration or loss animation speed
            var ANIMATE_TIME = 300;
            // Checks if currently playing a game
            var isPlaying = false;
            // timeout variable to clear timeout on new game
            var timeout;
            // celebrate interval variable to clear interval on new game
            var celeb;
            // Width of screen
            var WIDTH = Math.max(screen.width, screen.height);
            
            // Info passed in from URL search
            var inputs = parseURL(window.location.search);
            var nums = inputs.array;
            var sorted = inputs.sorted;
            var labeled = inputs.labeled;
            var bigO = inputs.bigO;
            var target = parseInt(inputs.target);
            
            $(function() {
                if (msieversion() < 0 || msieversion() >= 10) {  
                    loadCache();
                
                    // Initial / resized scaling.
                    scale();
                    $(window).resize(function() {
                        //scale();
                    });
                
                    // Disable image drag and toggle doors on click
                    $(".door").each(function() {
                        $(this).on('dragstart', function() {return false;});
                        $(this).click(function() {
                            checkDoor(this);
                        });
                    });
                    // Open doors on index click
                    $(".index").each(function() {
                        $(this).click(function() {
                            $(this).siblings(".door").eq(0).trigger("click");
                        });
                    });
                
                    $(".handle").each(function() {
                        $(this).on("mouseup", function() {
                            $(this).hide();
                        });
                    });
                    
                    // Sort Switch either sorts or shuffles numbers and starts new game
                    if (sorted === "0") {
                        $("#sortSwitch").bootstrapToggle("off");
                    }
                    else if (sorted === "1") {
                        $("#sortSwitch").bootstrapToggle("on");
                    }
                    $("#sortLabel").on("click", function() {
                        $("#sortSwitch").bootstrapToggle('toggle');
                    });
                    $("#sortSwitch").change(function() {
                        organizeNumbers();
                        loadNumbers(nums);
                        $(".door").each(function() {
                            closeDoor(this);
                        });
                        if (isPlaying) {
                            startGame();
                        }
                        cache();
                    });
                    
                    // Label switch toggles labels on and off.
                    if (labeled === "0") {
                        $("#labelSwitch").bootstrapToggle("off");
                        toggleLabels();
                    }
                    else if (labeled === "1") {
                        $("#labelSwitch").bootstrapToggle("on");
                        toggleLabels();
                    }
                    $("#labelLabel").on("click", function() {
                        $("#labelSwitch").bootstrapToggle('toggle');
                    });
                    $("#labelSwitch").change(function() {
                        toggleLabels();
                        cache();
                    });
                    
                    // Big O Switch prompts game to play in either 15 or 4 moves.
                    if (bigO === "logn") {
                        $("#oSwitch").bootstrapToggle("off");
                    }
                    else if (bigO === "n") {
                        $("#oSwitch").bootstrapToggle("on");
                    }
                    $("#OLabel").on("click", function() {
                        $("#oSwitch").bootstrapToggle('toggle');
                    });
                    $("#oSwitch").change(function() {
                        if (isPlaying) {
                            startGame();
                        }
                        cache();
                    });
                    
                    // Play Button starts new game
                    $("#playButton").on("click", function() {
                        organizeNumbers();
                        loadNumbers(nums);
                        clearInterval(celeb);
                        clearTimeout(timeout);
                        startGame();
                        $("#oSwitch").bootstrapToggle("enable");
                        $("#sortSwitch").bootstrapToggle("enable");
                    });
                    
                    // Generates array of numbers if not given
                    if (!nums) {
                        nums = generateNumbers();
                    }
                    organizeNumbers();
                    loadNumbers(nums);
                    startGame();
                    cache();
                }
                else {
                    $("body").html("Sorry! This widget requires a newer browser.");
                }
            });
            
            // Handles IE <= 9
            function msieversion() {
                    var ua = window.navigator.userAgent;
                    var msie = ua.indexOf("MSIE ");
                    // If Internet Explorer, return version number
                    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
                        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
                    else
                        return -1;
            }
            
            function scale() {
                var newWidth = $(window).width() / WIDTH * 1.3;
                $("#playButton").css("transform", "scale(" + newWidth + ", " + newWidth + ")");
                $("li").each(function() {
                    $(this).css("transform", "scale(" + newWidth + ", " + newWidth + ")");  
                });
            }
            
            /* Parses URL for nums, sorted, labeled, target, bigO */
            function parseURL(str) {
                var arr = "";
                var sorted = "";
                var labeled = "";
                var target = "50";
                var bigO = "";
                if (str.indexOf("target") !== -1) {
                    target = "";
                    for (var k = str.indexOf("target") + 7;
                            k < str.length && str.charAt(k) !== "&"; k++) {
                        target += str.charAt(k);
                    }
                }
                if (str.indexOf("array") !== -1) {
                    for (var k = str.indexOf("array") + 6; 
                             k < str.length && str.charAt(k) !== "&"; k++) {
                        arr += str.charAt(k);
                    }
                    arr = arr.split(",");
                    for (var k = 0; k < arr.length; k++) {
                        arr[k] = parseInt(arr[k], 10);
                    }
                    if (contains(arr, parseInt(target, 10), DOORS) === false) {
                        target = arr[Math.floor((Math.random() * DOORS))];
                    }
                }
                if (str.indexOf("labeled") !== -1
                    && str.indexOf("labeled") + 8 <= str.length) {
                    labeled = str.charAt(str.indexOf("labeled") + 8);
                }
                if (str.indexOf("bigO") !== -1
                    && str.indexOf("bigO") + 5 <= str.length) {
                    if (str.charAt(str.indexOf("bigO") + 5)==="n") {
                        bigO = "n";
                    }
                    else if (str.indexOf("bigO") + 5 === str.indexOf("logn")) {
                        bigO = "logn";
                    }
                }
                if (str.indexOf("sorted") !== -1
                    && str.indexOf("sorted") + 7 <= str.length) {
                    sorted = str.charAt(str.indexOf("sorted") + 7);
                }
                return {"array": arr, "sorted": sorted, "labeled" : labeled, 
                            "target" : target, "bigO" : bigO};
            }
            
            // Generates unique array of numbers always including the target
            function generateNumbers() {
                var arr = new Array(DOORS);
                for (var k = 0; k < DOORS; k++) {
                    do {
                        var x = Math.floor(Math.random() * (100));
                    }
                    while (contains(arr, x, k));
                    arr[k] = x;
                }
                if (!contains(arr, target, DOORS)) {
                    arr[0] = target;
                }
                return arr;
            }
            
            // checks if arr contains val up to current index in array
            function contains(arr, val, current) {
                for (var k = 0; k < current; k++) {
                    if (val === arr[k]) {
                        return true;
                    }
                }
                return false;
            }
            
            // Loads and adjusts number placement behind doors
            function loadNumbers(arr) {
                var i = 0;
                $(".room").each(function() {
                    $(this).children("p").attr("value", arr[i]);
                    $(this).children("p").html(arr[i]);
                    i++;
                });
            }
            
            // Sorts or shuffles numbers behind doors
            function organizeNumbers() {
                if ($("#sortSwitch").prop("checked")) {
                    nums.sort(function(a, b) {return a - b;});
                }
                else {
                    for (var k = nums.length - 1; k > 0; k--) {
                        var j = Math.floor(Math.random() * (k + 1));
                        var temp = nums[k];
                        nums[k] = nums[j];
                        nums[j] = temp;
                    }
                }
            }
            
            /* Opens door, checks value of number, and celebrates if correct. */
            function checkDoor(obj) {
                if (isPlaying) {
                    $("#oSwitch").bootstrapToggle("disable");
                    $("#sortSwitch").bootstrapToggle("disable");
                    tooltips("#oDiv, #sortDiv", "Start a new game to toggle switch!");
                    $("#OLabel, #sortLabel").css({
                        "cursor" : "-webkit-not-allowed",
                        "cursor" : "-moz-not-allowed",
                        "cursor" : "not-allowed"
                    });
                    $("#oDiv").addClass("importantRule");
                    $("#sortDiv").addClass("importantRule");
                }
                openDoor(obj);
                if (matchesValue(obj)) {
                    setNumColor(obj, "green");
                    celebrate(obj);
                }
                else {
                    if (isPlaying) {
                        var x = $("#steps").html();
                        $("#steps").html(parseInt(x) - 1);
                    }
                    if ($("#steps").html() === "1") {
                        var temp = $("#gameText").html();
                        var temp2 = temp.substring(0,temp.lastIndexOf("s"));
                        $("#gameText").html(temp2 + "!");
                    }
                    if ($("#steps").html() === "0") {
                        lose();
                    }
                }
            }
            
            /* Compares number of door to gameVal */
            function matchesValue(obj) {
                return $(obj).siblings().eq(0).attr("value") === $("#gameVal").attr("value");
            }
            /* Changes number color */
            function setNumColor(obj, color) {
                $(obj).siblings().eq(0).css("color", color);
            }
            
            // Opens the door
            function openDoor(obj) {
                var temp = $(obj).children(".index").eq(0);
                temp.css("visibility", "hidden");
                $(obj).css("visibility", "hidden");
            }
            
            // Closes the door
            function closeDoor(obj) {
                var temp = $(obj).children(".index").eq(0);
                temp.css("visibility", "visible");
                $(obj).css("visibility", "visible");
                setNumColor(obj, "black");
                $(".handle").each(function() {
                    $(this).show();
                });
            }
            
            // Loses the game, revealing the answer and closing doors.
            function lose() {
                $("#oDiv").qtip('destroy');
                $("#sortDiv").qtip('destroy');
                $("#sortSwitch").bootstrapToggle("disable");
                $("#oSwitch").bootstrapToggle("disable");
                $("#labelSwitch").bootstrapToggle("disable");
                $("#gameText").html("Time's up!");
                resetState();
                $("#sortSwitch").bootstrapToggle("enable");
                $("#labelSwitch").bootstrapToggle("enable");
                $("#oSwitch").bootstrapToggle("enable");
            }
            
            // Opens all doors, bounces numbers, closes doors.
            function celebrate(obj) {
                $("#sortSwitch").bootstrapToggle("disable");
                $("#oSwitch").bootstrapToggle("disable");
                $("#labelSwitch").bootstrapToggle("disable");
                $("#gameText").html("You win!");
                setNumColor(obj, "green");
                var toMove = $(obj).siblings("p").eq(0);
                celeb = setInterval(function() {
                    move(toMove, "-=1vw");
                    move(toMove, "+=1vw");
                }, ANIMATE_TIME);
                    
                timeout = setTimeout(function() {
                    clearInterval(celeb);
                    resetState();
                    $(obj).siblings("p").eq(0).css("top", "-5vw");
                    $("#sortSwitch").bootstrapToggle("enable");
                    $("#labelSwitch").bootstrapToggle("enable");
                    $("#oSwitch").bootstrapToggle("enable");
                    $("#oDiv").qtip('destroy');
                    $("#sortDiv").qtip('destroy');
                }, OPEN_TIME); 
            }
            
            // Moves element up and down by magnitude. For animation celebration.
            function move(obj, magnitude) {
                $(obj).animate({
                    top: magnitude
                }, ANIMATE_TIME/2);
            }
            
            //Resets to non-game state
            function resetState() {
                $("#gameVal").html("");
                $("#gameVal").attr("value", "");
            
                if ($("#oSwitch").prop("checked")) {
                    $("#steps").html("15");
                }
                else {
                    $("#steps").html("4");
                }
                $("#OLabel, #sortLabel").css({
                    "cursor" : "pointer"
                });
                $("#oDiv").removeClass("importantRule");
                $("#sortDiv").removeClass("importantRule");
                isPlaying = false;
            }
            
            // Initializes a game state.
            function startGame() {
                isPlaying = true;
                $("#gameText").html( 'Find <span id="gameVal"' + 
                    'value=""></span> in <span id="steps">15</span> steps!');
                if ($("#oSwitch").prop("checked") === false) {
                    $("#steps").html("4");
                }
                else {
                    $("#steps").html(DOORS);        
                }
                $(".door").each(function() {
                    closeDoor($(this));
                });
                $("#gameText").css("visibility", "visible");
                for (var k = 0; k < 10; k++) {
                var val = target;
                }
                $("#gameVal").html(val);
                $("#gameVal").attr("value", val);
            }
            
            //Enables and disables door indices
            function toggleLabels (state) {
                if (!state) {
                    $(".door").each(function() {
                        var temp = $(this).children(".index").eq(0);
                        if ($("#labelSwitch").prop("checked")) {
                            temp.html(temp.attr("id").substring(1));
                        }
                        else {
                            temp.html("&nbsp;");
                        }
                    });
                }
            }
            
            // Initializes tooltips
            function tooltips(c, str) {
                $(c).qtip({
                   content: { text: str },
                   position: {
                      target: 'mouse',
                      adjust: {
                        x: 15,
                        y: 20,
                        mouse: true,
                        resize: true
                      }
                   },
                   style: { classes: 'qtip-tipsy' }
                });
            }
            
            // Stores switch states in cache.
            function cache() {
                localStorage.setItem("oSwitch", $("#oSwitch").prop('checked'));
                localStorage.setItem("labelSwitch", $("#labelSwitch").prop('checked'));
                localStorage.setItem("sortSwitch", $("#sortSwitch").prop('checked'));
            }
            
            // Sets cache values of switches on page load
            function loadCache() {
                if (localStorage.getItem("oSwitch") === null) {
                    $("#oSwitch").bootstrapToggle("on");
                }
                else if (localStorage.getItem("oSwitch") === "true") {
                    $("#oSwitch").bootstrapToggle("on");
                }
                else {
                    $("#oSwitch").bootstrapToggle("off");
                }
                if (localStorage.getItem("labelSwitch") === null) {
                    $("#labelSwitch").bootstrapToggle("off");
                    toggleLabels();
                }
                else if (localStorage.getItem("labelSwitch") === "true") {
                    $("#labelSwitch").bootstrapToggle("on");
                }
                else {
                    $("#labelSwitch").bootstrapToggle("off");
                    toggleLabels();
                }
                if (localStorage.getItem("sortSwitch") === null) {
                    $("#sortSwitch").bootstrapToggle("on");
                }
                else if (localStorage.getItem("sortSwitch") === "true") {
                    $("#sortSwitch").bootstrapToggle("on");
                }
                else {
                    $("#sortSwitch").bootstrapToggle("off");
                }
            }
        </script>
        
        <title>Indoors</title>
        
    </head>
    
    <body>
    <div class="container">
        <div class="images">
            <div class="room">
                <div class="door" id="door0">
                    <p class="text index" id="i0">0</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num0" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door1">
                    <p class="text index" id="i1">1</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num1" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door2">
                    <p class="text index" id="i2">2</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num2" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door3">
                    <p class="text index" id="i3">3</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num3" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door4">
                    <p class="text index" id="i4">4</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num4" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door5">
                    <p class="text index" id="i5">5</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num5" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door6">
                    <p class="text index" id="i6">6</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num6" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door7">
                    <p class="text index" id="i7">7</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num7" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door8">
                    <p class="text index" id="i8">8</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num8" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door9">
                    <p class="text index" id="i9">9</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num9" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door10">
                    <p class="text index" id="i10">10</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num10" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door11">
                    <p class="text index" id="i11">11</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num11" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door12">
                    <p class="text index" id="i12">12</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num12" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door13">
                    <p class="text index" id="i13">13</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num13" value=""></p>
            </div>
            <div class="room">
                <div class="door" id="door14">
                    <p class="text index" id="i14">14</p>
                    <img src="<?= img_encode("img/door-still.png"); ?>">
                    <img class="handle" src="<?= img_encode("img/door-handle.png"); ?>">
                </div>
                <p class="text number" id="num14" value=""></p>
            </div>
        </div>
        <p class="text" id="gameText">
            Find the number <span id="gameVal" value=""></span> in <span id="steps">15</span> steps!
        </p>
        <center><button type="button" class="btn btn-primary btn-md" id="playButton">New Game</button></center>
        <center><ul>
            <!-- Label _div2 vs _div necessary for css hackishness -->
            <li id="oDiv2">
                <div id="oDiv">
                <div class="ttip button">
                    <p class="ttip text labels" id="OLabel">Efficiency</p>
                    <input class="ttip toggle-group" id="oSwitch"
                    checked type="checkbox" data-toggle="toggle" data-size="medium">  
                    <script>
                        $("#oSwitch").bootstrapToggle({
                            on: 'O(<i>n</i>)',
                            off: 'O(log<i>n</i>)',
                            onstyle: 'primary',
                            offstyle: 'primary'
                        });
                    </script>
                </div>
                </div>
            </li>
            <li id="labelDiv2">
                <div id="labelDiv">
                <div class="button">
                    <p class="text labels" id="labelLabel">Labels</p>
                    <input class="toggle-group" id="labelSwitch"
                    checked type="checkbox" data-toggle="toggle" data-size="medium">    
                </div>
                </div>
            </li>
            <li id="sortDiv2">
                <div id="sortDiv">
                <div class="ttip button">
                    <p class="ttip text labels" id="sortLabel">Sorted</p>
                    <input class="ttip toggle-group" id="sortSwitch" checked type="checkbox" 
                        data-toggle="toggle" data-size="medium">    
                </div>
                </div>
            </li>
        </ul></center>
        <p class="text" id="footer">Indoors by 
            <a href="https://cs50.harvard.edu/">CS50</a></p>
    </div>
    </body>
</html>