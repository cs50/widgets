<!-- 

CS50's Binary Bulbs

by Michael Ge, 2015

-->

<?php require(__DIR__ . "/../../lib/functions.php"); ?>

<!DOCTYPE html>
    <head>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="title" content="CS50 Binary Bulbs"/>
        <meta name="description" content="Learn to count in binary with CS50's Binary Bulbs!"/>

        <?php /* TODO: PNG missing
        <link rel="image_src" href="<?= img_encode("img/bulbs-thumb.png") ?>"/>
        */ ?> 

        <?php

            $styles = [
                "css/bootstrap.min.css",
                "css/bootstrap-toggle.css",
                "css/jquery.qtip.css",
                "css/bootstrap-dialog.css",
                "css/styles.css"
            ];
            foreach ($styles as $style) {
                print("\n<style>\n");
                print(file_get_contents($style));
                print("\n</style>\n");
            }

        ?>

        <?php

            $scripts = [
                "js/jquery.js",
                "js/jquery.qtip.js",
                "js/bootstrap.min.js",
                "js/bootstrap-toggle.js",
                "js/bootstrap-dialog.js",
                "js/scripts.js"
            ];
            foreach ($scripts as $script) {
                print("\n<script>\n");
                print(file_get_contents($script));
                print("\n</script>\n");
            }

        ?>

        <title>Binary Bulbs</title>

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
                    $k . "\" src=\"" . img_encode("img/bin_off_med.png") . "\" data-toggle=\"tooltip\" 
                    data-placement=\"bottom\" title=\"toggle state\">
                    <img class=\"on\" id=\"bulb" . $k . "on\" 
                    src=\"" . img_encode("img/bin_on_med.png") . "\" data-toggle=\"tooltip\" 
                    data-placement=\"bottom\" title=\"toggle state\"></figure>");
                }
            ?>
        </div>


        <div id="controller">
            <img value="1" class="ctrlButtons" id="up" src="<?= img_encode("img/up.png") ?>" 
                data-toggle="tooltip" data-placement="right" title="increment value"><br> 
            <span data-toggle="tooltip" title="value in decimal" 
                data-placement="right" class="text" id="decimal">0</span><br>
                <img value="-1" id="down" class="ctrlButtons" src="<?= img_encode("img/down.png") ?>" 
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
</html>
