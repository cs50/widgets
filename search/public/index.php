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
                </div>
                <p class="text number" id="num' . $k . '" value=""></p>
            </div>');
        }
    ?>
    </div>
    
    <p class="text" id="gameText">
        Find the number <span id="gameVal" value=""></span> in <span id="steps">15</span> steps!
    </p>
    <center><button type="button" class="btn btn-info btn-sm" id="playButton">New Game</button></center>
    <ul>
        <li>
            <div class="button ttip">
                <p class="text labels" id="OLabel">Efficiency</p>
                <input class="toggle-group" id="oSwitch" checked type="checkbox" 
                    data-toggle="toggle" data-size="small"> 
                <script>
                    $("#oSwitch").bootstrapToggle({
                        on: 'O(<i>n</i>)',
                        off: 'O(log<i>n</i>)',
                        onstyle: 'primary',
                        offstyle: 'primary'
                    });
                </script>
            </div>
        </li>
        <li>
            <div class="button">
                <p class="text labels" id="labelLabel">Labels</p>
                <input class="toggle-group" id="labelSwitch"
                checked type="checkbox" data-toggle="toggle" data-size="small">    
            </div>
        </li>
        <!--<li><button type="button" class="btn btn-info btn-md" id="playButton">Game Mode</button></li>-->
        <li>
            <div class="button ttip">
                <p class="text labels ttip" id="sortLabel">Sorted</p>
                <input id="sortSwitch" class="toggle-group" checked 
                    type="checkbox" data-toggle="toggle" data-size="small">    
            </div>
        </li>
    </ul>
    <p class="text" id="footer">Doors by 
        <a href="https://cs50.harvard.edu/">CS50</a></p>
</div>
</body>
</html>