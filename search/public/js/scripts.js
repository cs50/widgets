/* Search Widget
 * Michael Ge, 2015 */

/* Number of doors */
var DOORS = 15;
/* Duration Door is open */
var OPEN_TIME = 2000;
/* Celebration animation time */
var ANIMATE_TIME = 300;
/* Checks if currently playing */
var isPlaying = false;
/* Info passed in from URL search*/
var inputs = parseURL(window.location.search);
var nums = inputs.array;
var sorted = inputs.sorted;
var labeled = inputs.labeled;
var bigO = inputs.bigO;
var target = inputs.target;
//var prompted = inputs.prompted;

$(function() {
    /* Disable drag and toggle doors on click */
    $(".door").each(function() {
        $(this).on('dragstart', function() {return false;});
        $(this).click(function() {
            checkDoor(this);
        });
    });
    $(".index").each(function() {
        $(this).click(function() {
            $(this).siblings(".door").eq(0).trigger("click");
        });
    });
    $(".number").each(function() {
        $(this).click(function() {
            if (!isPlaying) {
                closeDoor($(this).siblings(".door").eq(0));
            }
        });
    });
    
    /* Sort Switch functionality */
    if (sorted === "0") {
        $("#sortSwitch").bootstrapToggle("off");
    }
    $("#sortLabel").on("click", function() {
        var x = $("#sortSwitch").prop("checked") === true ? "off" : "on";
        $("#sortSwitch").bootstrapToggle(x);
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
    });
    
    /* Label Switch functionality */
    if (labeled === "0") {
        $("#labelSwitch").bootstrapToggle("off");
        toggleLabels();
    }
    $("#labelLabel").on("click", function() {
        var x = $("#labelSwitch").prop("checked") === true ? "off" : "on";
        $("#labelSwitch").bootstrapToggle(x);
    });
    $("#labelSwitch").change(function() {
        toggleLabels();
    });
    
    /* Big O Switch functionality */
    if (bigO === "0") {
        $("#oSwitch").bootstrapToggle("off");
    }
    $("#OLabel").on("click", function() {
        var x = $("#oSwitch").prop("checked") === true ? "off" : "on";
        $("#oSwitch").bootstrapToggle(x);
    });
    $("#oSwitch").change(function() {
        if (isPlaying)
            startGame();
    });
    
    /* Play Button functionality */
    $("#playButton").on("click", function() {
        startGame();
    });
    
    /* Generates array of numbers and organizes */
    if (!nums) {
        nums = generateNumbers();
    }
    organizeNumbers();
    loadNumbers(nums);
    startGame();
});

/* Expects single comma-separated query, turns into default nums */
function parseURL(str) {
    var arr = "";
    var sorted = "1";
    var labeled = "0";
    var bigO = "1";
    //var prompted = "1";
    if (str.indexOf("array") !== -1) {
        for (var k = str.indexOf("array") + 6; 
                 k < str.length && str.charAt(k) !== "&"; k++) {
            arr+=str.charAt(k);
        }
        arr = arr.split(",");
        for (var k = 0; k < arr.length; k++) {
            arr[k] = parseInt(arr[k], 10);
        }
    }
    if (str.indexOf("sorted") !== -1
        && str.indexOf("sorted") + 7 <= str.length) {
        sorted = str.charAt(str.indexOf("sorted") + 7);
    }
    if (str.indexOf("labeled") !== -1
        && str.indexOf("labeled") + 8 <= str.length) {
        labeled = str.charAt(str.indexOf("labeled") + 8);
    }
    if (str.indexOf("bigO") !== -1
        && str.indexOf("bigO") + 5 <= str.length) {
        bigO = str.charAt(str.indexOf("bigO") + 5);
    }
/*    if (str.indexOf("prompt") !== -1
        && str.indexOf("prompt") + 7 <= str.length) {
        prompted = str.charAt(str.indexOf("prompt") + 7);
    }*/
    return {"array": arr, "sorted": sorted, "labeled" : labeled, 
        /*"prompted" : prompted,*/ "bigO" : bigO};
}

/* Not guaranteed to be unique */
function generateNumbers() {
    var arr = new Array(DOORS);
    for (var k = 0; k < DOORS; k++) {
        do {
            var x = Math.floor(Math.random() * (100));
        }
        while (contains(arr, x, k));
        arr[k] = x;
    }
    return arr;
}

function contains(arr, val, current) {
    for (var k = 0; k < current; k++) {
        if (val === arr[k]) {
            return true;
        }
    }
    return false;
}

/* Loads and adjusts numbers behind doors */
function loadNumbers(arr) {
    var i = 0;
    $(".room").each(function() {
        $(this).children("p").attr("value", arr[i]);
        $(this).children("p").html(arr[i]);
        i++;
    });
    $(".number").each(function() {
        adjustNumberPlace(this);
    });
}

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

/* Adjusts central placement in doors */
function adjustNumberPlace(obj) {
    if ($(obj).attr("value") >= 20) {
        $(obj).css("left", "2.5vw");
    }
    else if ($(obj).attr("value") >= 10) {
        $(obj).css("left", "2.7vw");
    }
    else {
        $(obj).css("left", "3vw");
    }
}

/* Opens door, checks value of number, and celebrates if correct. */
function checkDoor(obj) {
    openDoor(obj);
    if (matchesValue(obj)) {
        setNumColor(obj, "green");
        celebrate(obj);
    }
    else {
        if (isPlaying) {
            setNumColor(obj, "black");
            var x = $("#steps").html();
            $("#steps").html(parseInt(x)- 1);
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

/* Compares number to gameVal */
function matchesValue(obj) {
    return $(obj).siblings().eq(0).attr("value") === $("#gameVal").attr("value");
}
/* Changes number color */
function setNumColor(obj, color) {
    $(obj).siblings().eq(0).css("color", color);
}

/* Opens the door */
function openDoor(obj) {
    var temp = $(obj).children(".index").eq(0);
    temp.css("visibility", "hidden");
    $(obj).css("visibility", "hidden");
}

/* Closes the door */
function closeDoor(obj) {
    var temp = $(obj).children(".index").eq(0);
    temp.css("visibility", "visible");
    $(obj).css("visibility", "visible");
    setNumColor(obj, "black");
}

/* Loses the game, revealing the answer and closing doors. */
function lose() {
    $("#sortSwitch").bootstrapToggle("disable");
    $("#oSwitch").bootstrapToggle("disable");
    $("#labelSwitch").bootstrapToggle("disable");
    $(".door").each(function() {
        if (matchesValue(this)) {
            openDoor(this);
        }
    });
    $("#gameText").html("Time's up!");
    setTimeout(function() {
        $(".door").each(function() {
            closeDoor(this);
            setNumColor(this, "black");
        });
        resetState();
        $("#sortSwitch").bootstrapToggle("enable");
        $("#labelSwitch").bootstrapToggle("enable");
        $("#oSwitch").bootstrapToggle("enable");
        $("#gameText").html( 'Find the number <span id="gameVal"' + 
            'value=""></span> in <span id="steps">15</span> steps!');
    }, OPEN_TIME);
}

/* Opens all doors, bounces numbers, closes doors. */
function celebrate(obj) {
    $("#sortSwitch").bootstrapToggle("disable");
    $("#oSwitch").bootstrapToggle("disable");
    $("#labelSwitch").bootstrapToggle("disable");
    $("#gameText").html("You win!");
    
    setNumColor(obj, "green");
    
    var celeb = setInterval(function() {
        $(".number").each(function() {
            if ($(this).attr("color") === "green") {
                move(this, "-=20");
                move(this, "+=20");
            }
        });
    }, ANIMATE_TIME);
        
    setTimeout(function() {
        clearInterval(celeb);
        resetState();
        $("#sortSwitch").bootstrapToggle("enable");
        $("#labelSwitch").bootstrapToggle("enable");
        $("#oSwitch").bootstrapToggle("enable");
        $("#gameText").html( 'Find the number <span id="gameVal"' + 
            'value=""></span> in <span id="steps">15</span> steps!');
    }, OPEN_TIME * 2); 
}

/* Moves element by magnitude */
function move(obj, magnitude) {
    $(obj).animate({
        top: magnitude
    }, ANIMATE_TIME/2);
}

function resetState() {
    $("#gameVal").html("");
    $("#gameVal").attr("value", "");
    $("#gameText").css("visibility", "hidden");
    if ($("#oSwitch").prop("checked") === true) {
        $("#steps").html("15");
    }
    else {
        $("#steps").html("4");
    }
    isPlaying = false;
}

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

function initGame() {
    isPlaying = true;
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
    var val = nums[Math.floor(Math.random() * 7)];
    }
    $("#gameVal").html(val);
    $("#gameVal").attr("value", val);
}

function makeAlert(str) {
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
}

function toggleLabels () {
    $(".door").each(function() {
        var temp = $(this).children(".index").eq(0);
        if ($("#labelSwitch").prop("checked") === true) {
            temp.html(temp.attr("id").substring(1));
        }
        else {
            temp.html("");
        }
    });
}