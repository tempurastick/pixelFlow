
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


/* perlin noise field start */
    let yOffset = 0;
    for (let y = 0; y < rows; y++) {
       let xOffset = 0;
        for (let x = 0; x < cols; x++) {
            let index = (x + y * cols); // calculates how many array items we need in flowField
            let r = (noise(xOffset, yOffset)) *255; // 2d perlin noise
            let angle = noise(xOffset, yOffset, zOffset)* PI*2; // 2d perlin noise
            let vector = p5.Vector.fromAngle(angle);
            vector.setMag(.5);
            flowField[index] = vector;
            xOffset += increment;
            let showFlowField = function() {
                push();

             /*
             this is a pretty funny effect even if it's not what I want. Kinda reminds me of van gogh

                stroke(random(palette));
                translate(x * scale, y * scale);
                rotate(vector.heading());
                line(0,0,scale,0);*/

                pop();
            }

            showFlowField();

            //rect(x * scale, y * scale, scale, scale);
        }
            yOffset += increment;
       zOffset += 0.0005;
    }
    /* perlin noise field end */

    for ( i = 0; i < particles.length; i++) {
        particles[i].follow(flowField);
        particles[i].update();
        particles[i].edges();
        particles[i].show(paletteOne, paletteTwo, paletteThree, paletteFour); // passes colour variables as parameters
    }

    fr.html(floor(frameRate()));
}


function perlinNoiseDemo() {
    loadPixels();
    // two-dimensional perlin noise
    for (let x = 0; x < width; x++) {
        let yOffset = 0; // we need to set the yOffset inside the x-axis loop

        for (let y = 0; y < height; y++) {
            let index = (x + y * width) * 4; // what happens here?
            let r = (noise(xOffset, yOffset)) *255;
            pixels[index] = r;
            pixels[index+1] = r;
            pixels[index+2] = r;
            pixels[index+3] = 255;

            yOffset += increment;
        }
        xOffset += increment;
    }
    updatePixels();
}

function staticNoise() {
    /* TODO look-up loadPixels and how to use pixels in p5.js */
    loadPixels();
    // basically static noise
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let index = (x + y * width) * 4; // what happens here?
            let r = random(255);
            pixels[index] = r;
            pixels[index+1] = r;
            pixels[index+2] = r;
            pixels[index+3] = 255;
        }
    }
    updatePixels();
}

// one-dimensional perlin noise
function noiseGraph() {
    let xOffset = 0; // default xOffset value we pick
    let xOffset2 = 200; // different start value
    let increment = 0.01; // modifies noise x-graph increment
    let start = 0;

    background(255);
    strokeWeight(1);
    noFill();
    beginShape();
    xOffset = start; // ties xOffset to our start value
    for (let x = 0; x < width; x++) {
        //vertex(random(160), random(144)); // pure randomness
        //vertex(x, random(144)); // random graph on y-axis
        let y = noise(xOffset) * height; // xOffset value is the "start" point of the perlin noise
        vertex(x, y); // random graph on y-axis

        xOffset += increment; // refresh seed
    }
    endShape();

    start += increment; // by incrementing the start value we're moving along the x-axis of the perlin noise
}

function noiseExplanation() {
    //map(value, start1, stop1, start2, stop2, [withinBounds])
    let randomX = map(noise(xOffset), 0, 1, 0, width);
    let randomY = map(noise(xOffset2), 0, 1, 0, height);
    square(randomX, randomY, pixelSize, pixelSize);
    xOffset += 0.01; // refreshes the noise seed, also changes the speed
    xOffset2 += 0.01; // refreshes the noise seed
}

// one-dimensional perlin noise end

function pixel(pixelSize) {
    pixelSize = 1; // default fallback
    square(mouseX, mouseY, pixelSize);
}

/*function mousePressed() {
    rect(mouseX, mouseY, pixelSize, pixelSize);
}*/
