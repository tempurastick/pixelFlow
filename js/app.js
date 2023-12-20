/* variables */
let canvasWidth = 160;
let canvasHeight = 144;
let backgroundColour = 255;
let pixelSize = 1;
let xOffset = 1; // default xOffset value we pick
let xOffset2 = 80; // different start value
let increment = 0.1; // modifies noise x-graph increment | the higher the value, the more chaotic it gets
let start = 0;
let scale = 10; // scale of one flow  point
let cols, rows;
let fr;
let rModifier = 10;
let angleModifier = 2;
let zOffset = 0;
let paletteOne = "#222323";
let paletteTwo = "#f0f6f0";

let palette = ["#222323", "#f0f6f0", '#8bc8fe', '#051b2c', '#1b1233', '#dcf29d', '#1d0f44', '#f44e38'];
let particles = [];
let secondParticle = [];
let particleNumber = 3000;

let flowField;

let quad;

let backgroundInclusion = false;

function setup() {
        // need to add a proper calculation for pixel size upon grabbed canvas
    // scaled x10
    let magnifier = 4;
    canvasWidth = canvasWidth*magnifier;
    canvasHeight = canvasHeight*magnifier;
    pixelSize = pixelSize*magnifier;

    let shuffle = floor(random(0, 2));

    /* rng values */
    scale = floor(random(6, 20));
    rModifier = floor(random(1, 15));
    angleModifier = random(0, 5);
    /* rng values end */

    if ( shuffle === 0 ) {
        backgroundInclusion = true;
    }
    // rudimentary shuffle
    let paletteChoice = floor(random(0, palette.length));
    if (paletteChoice < 2 ) {
        paletteOne = palette[2];
        paletteTwo = palette[3];
    } else if (paletteChoice < 4) {
        paletteOne = palette[4];
        paletteTwo = palette[5];
    } else if (paletteChoice < 6) {
        paletteOne = palette[6];
        paletteTwo = palette[7];
    }

    createCanvas(canvasWidth,canvasHeight);
    pixelDensity(1); // one px per px
    cols = floor(width/scale);
    rows = floor(height/scale);
//    fr = createP('');
    flowField = new Array(cols * rows);

    quad = new Quadtree({
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight
    })

    if ( backgroundInclusion == true ) {
        particleNumber = 9000;
        for ( i = 0; i < particleNumber; i++) {
            secondParticle[i] = new SecondParticle(random(width) , random(height), pixelSize);
        }
    } else {
        for ( i = 0; i < particleNumber; i++) {
            secondParticle[i] = new SecondParticle(random(width) , random(height), pixelSize);
        }
        for ( i = 0; i < particleNumber; i++) {
            particles[i] = new Particle(random(width), random(height), pixelSize);
        }
    }

    document.body.style.backgroundColor = paletteOne;
let refreshBtn = document.getElementById('refreshPage');
refreshBtn.style.backgroundColor = paletteTwo;
refreshBtn.style.color = paletteOne;
    refreshBtn.addEventListener("click", function() {
        location.reload();
    });


/*    let button = document.getElementById('scaleUp');
    button.addEventListener("click", function() {
        scaleUp(2);
    });*/
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
    if ( backgroundInclusion == true ) {
        background(paletteOne); // TODO turn off after demo
    } else {
        particleInvokation(paletteOne, particles);
    }

    quad.clear();
    riverFlow(paletteOne, particles);
    particleInvokation(paletteTwo, secondParticle);

    // frameRate checker
    //fr.html(floor(frameRate()));
}

// flowfield try to move it less
function riverFlow(colour, particles) {
    /* perlin noise field start */
    let yOffset = 0;
    for (let y = 0; y < rows; y++) {
        let xOffset = 0;
        for (let x = 0; x < cols; x++) {
            let index = (x + y * cols); // calculates how many array items we need in flowField
            let r = (noise(xOffset, yOffset))*rModifier; // 2d perlin noise
            let angle = noise(xOffset, yOffset, zOffset)*PI*angleModifier; // 2d perlin noise
            let vector = p5.Vector.fromAngle(angle);
            vector.setMag(.02);
            flowField[index] = vector;
            xOffset += increment;
        }
        yOffset += increment;
        zOffset += 0.0006; // velocity
    }

    let range = new Rectangle(0, 0, canvasWidth, canvasHeight);
    let particlesInRange = quad.retrieve(range);
    /* perlin noise field end */
}

/*
* Debating turning the particles into something other than a single pixel for each particle because it's pretty heavy.
* Alternative would be to use a different shape and get to the dithering via collision testing.
* */

function particleInvokation(colour, particles) {
    for ( i = 0; i < particles.length; i++) {
        particles[i].follow(flowField);
        particles[i].update();
        particles[i].edges();
        particles[i].show(colour); // passes colour variables as parameters
        // Insert the particle into the Quadtree
        quad.insert({
            pos: particles[i].pos,
            width: pixelSize,
            height: pixelSize
        });
    }
}

/* TODO
*   future implementation: device rotation / angle
*  so that the stream gets changed when you shake etc the phone
*   https://p5js.org/reference/#/p5/deviceTurned
*
*  check out these examples:
*   https://www.youtube.com/watch?app=desktop&v=nnSqPzOAmvc
*
* Tim:
*  Bin-lettal spacial subdivision -> in nature of code
*
* might change the logic from particles to boids / quadtree
* https://www.youtube.com/watch?v=OJxEcs0w_kE&pp=ygULcXVhZHRyZWUgcDU%3D
*
* */

