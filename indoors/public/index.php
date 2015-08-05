<!--Search Widget
    Michael Ge, 2015-->
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
    <?php
    $doors = 15;
        for ($k = 0; $k < $doors; $k++) {
            print(
            '<div class="room">
                <div class="door" id="door' . $k . '">
                    <p class="text index" id="i' . $k . '">' . $k . '</p>
                    <img src="img/door-still.png">
                    <img class="handle" src="img/door-handle.png">
                </div>
                <p class="text number" id="num' . $k . '" value=""></p>
            </div>');
        }
    ?>
    </div>
    
    <p class="text" id="gameText">
        Find the number <span id="gameVal" value=""></span> in <span id="steps">15</span> steps!
    </p>
    <center><button type="button" class="btn btn-primary btn-md" id="playButton">New Game</button></center>
    <center><ul>
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
        <!--<li><button type="button" class="btn btn-info btn-md" id="playButton">Game Mode</button></li>-->
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