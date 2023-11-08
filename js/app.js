
/* variables */
let canvasWidth = 160;
let canvasHeight = 144;
let backgroundColour = 255;
let pixelSize = 1;
let xOffset = 1; // default xOffset value we pick
let xOffset2 = 200; // different start value
let increment = 0.1; // modifies noise x-graph increment
let start = 0;
let scale = 4; // scale of one flow  point
let cols, rows;
let fr;
let zOffset = 0;
let paletteOne = "#ff7777";
let paletteTwo = "#ffce96";
let paletteThree = "#00303b";
let paletteFour = "#f1f2da";

let palette = [paletteOne, paletteTwo, paletteThree, paletteFour];

let particles = [];
let particleNumber = 10000;

let flowField;

/* TODO:
*   separate the vectors into two or three different flows
*   make the flowfield imitate marbled paper flows
*   performance tweaks
*   fix the running out of particles over long time
*   randomise colour palette via API
* */
function setup() {
    createCanvas(canvasWidth,canvasHeight);
    pixelDensity(1); // one px per px
    cols = floor(width/scale);
    rows = floor(height/scale);
    fr = createP('');
    flowField = new Array(cols * rows);
    //background(backgroundColour);
    for ( i = 0; i < particleNumber; i++) {
        particles[i] = new Particle();
    }
    background(paletteFour);
    scaleUp(1);

    let button = document.getElementById('scaleUp');
    button.addEventListener("click", function() {
        scaleUp(2);
    });
}

function scaleUp(multiplier) {
    /* TODO
    currently does not reflect starting point
    */
    scale = scale*multiplier;
    pixelSize = multiplier;
    resizeCanvas(canvasWidth*multiplier, canvasHeight*multiplier);
}

function draw() {
    riverFlow(paletteOne, xOffset = 50, yOffset = 5, zOffset, increment = 0.9);
    riverFlow(paletteTwo, xOffset = 0,yOffset = 20, zOffset = 10, increment);
    // frameRate checker
    fr.html(floor(frameRate()));
}

function riverFlow(colour, xOffset, yOffset, zOffset, increment) {
    /* perlin noise field start */
    //let yOffset = 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let index = (x + y * cols); // calculates how many array items we need in flowField
            let r = (noise(xOffset, yOffset))*10; // 2d perlin noise
            let angle = noise(xOffset, yOffset, zOffset)* PI*2; // 2d perlin noise
            let vector = p5.Vector.fromAngle(angle);
            vector.setMag(.5);
            flowField[index] = vector;
            xOffset += increment;
            let showFlowField = function() {
                push();
                /* shows the flowfield that is happening in the background */
                /*
                this is a pretty funny effect even if it's not what I want. Kinda reminds me of van gogh

                   stroke(random(palette));
                   translate(x * scale, y * scale);
                   rotate(vector.heading());
                   line(0,0,scale,0);*/
                pop();
            }

            showFlowField();
        }
        yOffset += increment;
        zOffset += 0.0005;
    }
    /* perlin noise field end */

    for ( i = 0; i < particles.length; i++) {
        particles[i].follow(flowField);
        particles[i].update();
        particles[i].edges();
        particles[i].show(colour); // passes colour variables as parameters
    }
}

function pixel(pixelSize) {
    pixelSize = 1; // default fallback
    square(mouseX, mouseY, pixelSize);
}


