<?php

    // base64-encodes an image with specified path
    function img_encode($path) {
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        return "data:image/{$type};base64," . base64_encode($data);
    }

?>
