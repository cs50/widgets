# widgets50

Online Widgets for CS50. Includes the following:
1. Bulbs - a binary arithmetic widget displaying both bulbs and bit representations as well as the option for a game mode.
2. Doors - a search tool widget hiding numbers behind doors. The user can search 15 doors in either O(n) or O(logn) time.

Embedding Instructions
1. Bulbs
Embed bulbs with an iframe linking to index.php with a width and height. Include teststyles.css as css file for 
appropriate resizing.

Bulbs will always restore the previously cached state of the bulbs and switches.

2. Doors
Embed doors with an iframe linking to index.php with a width and height. Include teststyles.css as css file for
appropriate resizing.

Doors has several options passed in as URL query values:

  array: A comma-separated array of 15 numbers within the range of 0 and 99. If an array is not passed in, a pseudorandom
  array will be generated. If target is not specified, array will include the number 50.
    Ex. url/?array=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
    Sets door values to numbers in array.
    
  sorted: States whether numbers should be sorted (1) or unsorted (0).
    Ex: url/?sorted=1
    Array, specified or not, will be sorted.
    
  target: Gives the value of the target in the array. If not specified, defaults to 50 if in the array or a random number
  if 50 is not in the array. If an array is not specified, target becomes a pseudorandom number in the generated array.
  If the specified array does not contain the target, a pseudorandom number will be chosen in the array for the target instead.
    Ex: url/?target=12
    Target for the game will always be the number 12. Generated array will also always contain 12.
    
  labeled: Determines whether doors are labeled with indices (1) or not (0).
    Ex: url/?labeled=1
    Doors will be labeled with indices.
    
If options are not passed in, the widget will restore the cached state of the previous pageload.
