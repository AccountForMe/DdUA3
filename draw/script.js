const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function applyShader() {
    const textureSrc = document.getElementById('texture').src;
    const modelEntity = document.getElementById('model');
    const modelMesh = modelEntity.getObject3D('mesh');
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(textureSrc, (texture) => {
        modelMesh.traverse((node) => {
            if (node.isMesh) {
                node.material.map = texture;
                node.material.needsUpdate = true;
            }
        });
    });
}



AFRAME.registerShader('texture-overlay', {
    schema: {
      color: { type: 'color', is: 'uniform' },
      timeMsec: { type: 'time', is: 'uniform' },
      texture: { type: 'map', is: 'uniform' }
    },
  
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
  
    fragmentShader: `
      uniform vec3 color;
      uniform sampler2D texture;
      varying vec2 vUv;
      void main() {
        vec4 texColor = texture2D(texture, vUv);
        vec3 finalColor = mix(texColor.rgb, color, 0.5);
        gl_FragColor = vec4(finalColor, texColor.a);
      }
    `
  });
  

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
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white'; // Set the color to black
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

function overlayImagesAndDownload() {
    const largeImage = document.getElementById('large-image');
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = 1230;
    overlayCanvas.height = 1230;
    const overlayCtx = overlayCanvas.getContext('2d');

    overlayCtx.drawImage(largeImage, 0, 0);
    overlayCtx.drawImage(canvas, 465, 914, 300, 300);

    // Convert the overlay canvas to a data URL
    const dataUrl = overlayCanvas.toDataURL('image/png');

    // Create a download link
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'overlayedImage.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Remove the download link from the document
}

// Call the overlayImagesAndDownload function
overlayImagesAndDownload();


// Call the applyTexture function
applyTexture();


// Call the overlayImagesAndDownload function
overlayImagesAndDownload();

