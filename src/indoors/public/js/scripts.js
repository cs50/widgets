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
        $(window).resize(function(){
            scale();
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
    var newWidth = Math.max(0.8, $(window).width() / WIDTH);
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