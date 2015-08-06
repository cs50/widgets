<!--Search Widget
    Michael Ge, 2015-->
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="title" content="CS50 Indoors" />
    <meta name="description" content="Use binary and linear search to find the number!" />
    <link rel="image_src" href="img/indoors-thumb.png" />
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-toggle.css">
    <link rel="stylesheet" type="text/css" href="css/jquery.qtip.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-dialog.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="js/jquery.js"></script>
    <script src="js/jquery.qtip.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/bootstrap-toggle.js"></script>
    <script src="js/bootstrap-dialog.js"></script>      
    <script src="js/scripts.js"></script>
</head>
<body>
<div class="container">
    <div class="images">
        <div class="room">
            <div class="door" id="door0">
                <p class="text index" id="i0">0</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num0" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door1">
                <p class="text index" id="i1">1</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num1" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door2">
                <p class="text index" id="i2">2</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num2" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door3">
                <p class="text index" id="i3">3</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num3" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door4">
                <p class="text index" id="i4">4</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num4" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door5">
                <p class="text index" id="i5">5</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num5" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door6">
                <p class="text index" id="i6">6</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num6" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door7">
                <p class="text index" id="i7">7</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num7" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door8">
                <p class="text index" id="i8">8</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num8" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door9">
                <p class="text index" id="i9">9</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num9" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door10">
                <p class="text index" id="i10">10</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num10" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door11">
                <p class="text index" id="i11">11</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num11" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door12">
                <p class="text index" id="i12">12</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num12" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door13">
                <p class="text index" id="i13">13</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
            </div>
            <p class="text number" id="num13" value=""></p>
        </div>
        <div class="room">
            <div class="door" id="door14">
                <p class="text index" id="i14">14</p>
                <img src="img/door-still.png">
                <img class="handle" src="img/door-handle.png">
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