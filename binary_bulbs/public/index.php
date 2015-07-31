<!--Binary Bulbs Widget
    Michael Ge, 2015-->
<!DOCTYPE html>
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
    <center> <!-- Fixes off-center down button...-->
    <div class="container">
        <div class="images">
            <?php
                $ids = 8;
                $MAX = 256;
                for ($k = 0; $k < $ids; $k++)
                {
                    $MAX /= 2;
                    print("<figure class=\"box\">
                    <figcaption value=\"" . $MAX . "\" class=\"text labels\" id=\"label" . 
                    $k . "\">" . $MAX . "</figcaption>
                    <img value=\"" . $MAX . "\" class=\"bulb\" id=\"bulb" . 
                    $k . "\" src=\"img/bin_off_med.png\" data-toggle=\"tooltip\" 
                    data-placement=\"bottom\" title=\"toggle state\">
                    <img class=\"on\" id=\"bulb" . $k . "on\" 
                    src=\"img/bin_on_med.png\" data-toggle=\"tooltip\" 
                    data-placement=\"bottom\" title=\"toggle state\"></figure>");
                }
            ?>
        </div>


        <div id="controller">
            <img value="1" class="ctrlButtons" id="up" src="img/up.png" 
                data-toggle="tooltip" data-placement="right" title="increment value"><br> 
            <span data-toggle="tooltip" title="value in decimal" 
                data-placement="right" class="text" id="decimal">0</span><br>
            <img value="-1" id="down" class="ctrlButtons" src="img/down.png" 
                data-toggle="tooltip" data-placement="right" title="decrement value">
            <p class="text" id="game">
                How do you represent the number
                    <span id="gameVal"></span>
                in binary?
            </p>
        </div>
         
        <ul id="settings">
            <li>
            <div class="button" id="button3">
                <p class="text" id="bulbsMode">Bulbs</p>
                <input id="bulbSwitch" class="toggle-group"
                checked type="checkbox" data-toggle="toggle" data-size="mini">    
            </div>
            </li>
            <li>
            <div class="button" id="button1">
                <p class="text" id="gameLabel">Game Mode</p>
                <input id="gameSwitch" class="toggle-group" 
                    unchecked type="checkbox" data-toggle="toggle" data-size="mini">
            </div>
            </li>
            <li>
            <div class="button" id="button2">
            <p class="text" id="bitLabel">Labels</p>
                <input id="bitSwitch" class="toggle-group" 
                    checked type="checkbox" data-toggle="toggle" data-size="mini">    
            </div>
            </li>
        </ul>
        <br>
        <p class="text" id="footer">Binary Bulbs by 
            <a href="https://cs50.harvard.edu/">CS50</a></p>
    </div>
    </center>
    </body>
