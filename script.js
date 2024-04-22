var combination = [0, 0, 0]; // Initial combination
var maxDigitValue = 9; // Maximum digit value

function toggleMenu() {
    var menu = document.querySelector('.menu-container');
    var box = document.querySelector('.menu-button');

    if (menu.classList.contains("open")) {
        console.log('300');
        menu.classList.add("closed");
        menu.classList.remove("open");
        
    } else {
        console.log('-300');
        menu.classList.add("open");
        menu.classList.remove("closed");
        box.classList.remove("startanimation");
    }
}

function changeDigit(change, digitIndex) {
    combination[digitIndex] += change;
    if (combination[digitIndex] < 0) {
        combination[digitIndex] = maxDigitValue;
    } else if (combination[digitIndex] > maxDigitValue) {
        combination[digitIndex] = 0;
    }
    document.getElementById('digit' + (digitIndex + 1)).innerText = combination[digitIndex];
}

function checkCombination() {
    var targetCombination = [6, 8, 4]; // The target combination to match
    if (combination.join('') === targetCombination.join('')) {
        console.log('Combination is correct!'); // Debug print statement
        var cake = document.querySelector('.cakeprtl');
        cake.classList.add('visible'); // Add the 'visible' class to the cake entity
        cake.classList.remove('cakeprtl'); // Add the 'visible' class to the cake entity
    }
}

function draw() {
    window.location.href = 'draw/draw.html';
}

//////////////////////////////////////////////DRAW
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots(); // Redraw the dots after clearing
}

function draw(x, y) {
    console.log('x:', x, 'y:', y); // Print the coordinates

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.stroke();
    lastX = x;
    lastY = y;
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        draw(e.offsetX, e.offsetY);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
});

canvas.addEventListener('touchmove', (e) => {
    if (isDrawing) {
        e.preventDefault();
        draw(e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop);
    }
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
});

// Define the positions of the 7 dots
const dots = [
    { x: 30, y: 120 },
    { x: 160, y: 120 },
    { x: 160, y: 50 },
    { x: 280, y: 150 },
    { x: 160, y: 250 },
    { x: 160, y: 180 },
    { x: 30, y: 180 }
];

function drawDots() {
    dots.forEach((dot, index) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'white'; // Set the color to white
        ctx.fill();

        // Draw the number next to the dot
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black'; // Set the color to black
        ctx.fillText(index + 1, dot.x + 8, dot.y - 8);
    });
}

// Initial drawing of the dots
drawDots();

document.getElementById('clear-btn').addEventListener('click', clearCanvas);

document.getElementById('download-btn').addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'canvas.png';
    a.click();
});
