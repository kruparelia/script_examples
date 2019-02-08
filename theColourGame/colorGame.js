var numSquares = 6;
var colors;
var pickedColor;
var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.getElementById("message");
var h1 = document.querySelector("h1");
var resetButton = document.getElementById("reset");
var modeButtons = document.querySelectorAll(".mode");
init();
resetButton.addEventListener("click", function () {
    reset();
});

//functions
function init() {
    setupModeButtons();
    setupSquares();
    reset();
}

function setupModeButtons() {
    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].addEventListener("click", function () {
            modeButtons[0].classList.remove("selected");
            modeButtons[1].classList.remove("selected");
            this.classList.add("selected");
            if (this.textContent === "Easy") {
                numSquares = 3;
            }
            else {
                numSquares = 6;
            }
            reset();
        });
    }
}

function setupSquares(){
    for (var i = 0; i < squares.length; i++) {
        //add click event
        squares[i].addEventListener("click", function () {
            //grab colour of clicked square
            var clickedColor = this.style.background
                //compare to picked
            if (clickedColor === pickedColor) {
                messageDisplay.textContent = "Correct!"
                resetButton.textContent = "Play Again?";
                changeColors(clickedColor);
                h1.style.background = clickedColor;
            }
            else {
                this.style.background = "#232323";
                messageDisplay.textContent = "Try Again"
            }
        });
    }
}

function reset() {
    h1.style.background = "steelblue";
    //change play again to new colors in button
    resetButton.textContent = "New Colors";
    //generate all new colors
    colors = generateRandomColors(numSquares);
    //pick new random color from array
    pickedColor = pickColor();
    //change colour display to match picked color
    colorDisplay.textContent = pickedColor;
    //change messgae display
    messageDisplay.textContent = "";
    //change colours on squares
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.background = colors[i];
        }
        else {
            squares[i].style.display = "none";
        }
    }
}


function changeColors(color) {
    //loop through all squares and change each color to match given color
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = color;
    }
}

function pickColor() {
    var random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function generateRandomColors(num) {
    //make an array
    var arr = [];
    //add num random colors
    for (var i = 0; i < num; i++) {
        //get random color and push into array
        arr.push(randomColor());
    }
    //return array
    return arr;
}

function randomColor() {
    //pick a red
    var r = Math.floor(Math.random() * 256);
    //pick a green
    var g = Math.floor(Math.random() * 256);
    //pick a blue
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")"
}
