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
//var prompted = inputs.prompted;

$(function() {
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
    /*$(".number").each(function() {
        $(this).click(function() {
            if (!isPlaying) {
                closeDoor($(this).siblings(".door").eq(0));
            }
        });
    });*/
    $(".handle").each(function() {
        $(this).on("mouseup", function() {
  //          $(this).siblings("img").eq(0).trigger('click');
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
        console.log('toggled off');
    }
    else if (bigO === "n") {
        console.log('toggled on');
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
});

function scale() {
    var newWidth = Math.max(0.8, $(window).width() / WIDTH);
    $("#playButton").css("transform", "scale(" + newWidth + ", " + newWidth + ")");
    $("li").each(function() {
        $(this).css("transform", "scale(" + newWidth + ", " + newWidth + ")");  
    });
}

/* Parses URL for nums, sorted, labeled, target, bigO and -not prompt- */
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
/*    if (str.indexOf("prompt") !== -1
        && str.indexOf("prompt") + 7 <= str.length) {
        prompted = str.charAt(str.indexOf("prompt") + 7);
    }*/
    return {"array": arr, "sorted": sorted, "labeled" : labeled, 
        /*"prompted" : prompted,*/ "target" : target, "bigO" : bigO};
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
    $(".ttip").qtip('destroy');
    $("#sortSwitch").bootstrapToggle("disable");
    $("#oSwitch").bootstrapToggle("disable");
    $("#labelSwitch").bootstrapToggle("disable");
    $("#gameText").html("You win!");
    setNumColor(obj, "green");
    celeb = setInterval(function() {
        move($(obj).siblings("p").eq(0), "-=1vw");
        move($(obj).siblings("p").eq(0), "+=1vw");
    }, ANIMATE_TIME);
        
    timeout = setTimeout(function() {
        clearInterval(celeb);
        resetState();
        $(obj).siblings("p").eq(0).css("top", "-5vw");
        $("#sortSwitch").bootstrapToggle("enable");
        $("#labelSwitch").bootstrapToggle("enable");
        $("#oSwitch").bootstrapToggle("enable");
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
        "cursor" : "pointer",
    });
    $("#oDiv").removeClass("importantRule");
    $("#sortDiv").removeClass("importantRule");
    isPlaying = false;
}

//Starts a game by initializing a game state.
function startGame() {
    /*if (prompted === "1") {
         var dialog = new BootstrapDialog({
                title: "Input " + DOORS + " numbers between 0 and 99",
                message: function(dialogRef){
                    var $message = $('<div id="vals"><input autofocus type="text"' + 
                        'class="form-control" id="v0" placeholder="' + nums[0] + '">' +
                        '<input type="text" class="form-control" id="v1" placeholder="' + nums[1] + '">' +
                        '<input type="text" class="form-control" id="v2" placeholder="' + nums[2] + '">' +
                        '<input type="text" class="form-control" id="v3" placeholder="' + nums[3] + '">' +
                        '<input type="text" class="form-control" id="v4" placeholder="' + nums[4] + '">' +
                        '<input type="text" class="form-control" id="v5" placeholder="' + nums[5] + '">' +
                        '<input type="text" class="form-control" id="v6" placeholder="' + nums[6] + '">' +
                        '<input type="text" class="form-control" id="v7" placeholder="' + nums[7] + '">' +
                        '<input type="text" class="form-control" id="v8" placeholder="' + nums[8] + '">' +
                        '<input type="text" class="form-control" id="v9" placeholder="' + nums[9] + '">' +
                        '<input type="text" class="form-control" id="v10" placeholder="' + nums[10] + '">' +
                        '<input type="text" class="form-control" id="v11" placeholder="' + nums[11] + '">' +
                        '<input type="text" class="form-control" id="v12" placeholder="' + nums[12] + '">' +
                        '<input type="text" class="form-control" id="v13" placeholder="' + nums[13] + '">' +
                        '<input type="text" class="form-control" id="v14" placeholder="' + nums[14] + '"><br>');
                    var $button = $('<button type="submit" id="gok" class="btn ' + 
                                        'btn-primary btn-block">OK</button></div>');
                    $button.on('click', {dialogRef: dialogRef}, function(event) {
                        var tempArr = Array(DOORS);
                        for (var k = 0; k < DOORS; k++) {
                            if ($("#v" + k).val() == "") {
                                $("#v" + k).val($("#v" + k).attr("placeholder"));
                            }
                            var result = $("#v" + k).val();
                            if (isNaN(result)) {
                                makeAlert("Inputs must be numbers!");
                                return false;
                            }
                            else if (result < 0 || result > 99) {
                                makeAlert("Numbers must be between 0 and 99!");
                                return false;
                            }
                            else if (result%1 != 0) {
                                makeAlert("Numbers must be integers!");
                                return false;
                            }
                            tempArr[k] = result;
                        }
                        for (var k = 0; k < tempArr.length - 1; k++) {
                            for (var j = k + 1; j < tempArr.length - 1; j++) {
                                if (tempArr[k] === tempArr[j]) {
                                    makeAlert("No duplicate numbers!");
                                    return false;
                                }
                            }
                        }
                        nums = tempArr;
                        organizeNumbers();
                        loadNumbers(nums);
                        initGame();
                        event.data.dialogRef.close();
                    });
                    $message.append($button);
                    return $message;
                },
                closable: false,
                onshown: function() { 
                    $("#v0").focus(); 
                }
            });
        dialog.realize();
        dialog.getModalFooter().hide();
        dialog.setClosable(true);
        dialog.getModalBody().css('color', '#fff');
        dialog.open();
    }
    else {*/
        initGame();
//    }
}

// Initializes a game state.
function initGame() {
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

// Makes an alert for incorrect inputs to modal
/*function makeAlert(str) {
    var alrt = new BootstrapDialog({
        title: str,
        message: function(dialogRef) {
            var $btn = $('<button type="submit" class="btn btn-primary btn-block">OK</button></div>');
            $btn.on('click', {dialogRef: dialogRef}, function(event) {
                event.data.dialogRef.close();
            });
            return $btn;
        }
    });
    alrt.realize();
    alrt.getModalFooter().hide();
    alrt.setClosable(false);
    alrt.getModalBody().css('color', '#000');
    alrt.open();
}*/

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