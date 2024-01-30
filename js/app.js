/* variables */
let canvasWidth = 160;
let canvasHeight = 144;
let backgroundColour = 255;
let pixelSize = 1;
let xOffset = 1; // default xOffset value we pick
let xOffset2 = 80; // different start value
let increment = 0.1; // modifies noise x-graph increment | the higher the value, the more chaotic it gets
let start = 0;
let scale = 20; // scale of one flow  point
let cols, rows;
let fr;
let rModifier = 10;
let angleModifier = 2;
let magnitude;
let scaleModifier;
let angle;
let zOffset = 0;
// fallback palettes
let paletteOne = "#222323";
let paletteTwo = "#f0f6f0";

let palette;
let particles = [];
let secondParticle = [];
let particleCollection = [];
let particleNumber = 2000;

let flowField;
let qtree;

let backgroundInclusion = false;
let pixelGridInclusion = false;

let flowState;
const noField = 1;
const classicField = 2;
const waveField = 3;
const spinField = 4;
const funkyField = 5;


function preload() {
    let url = "./json/palettes.json";
    palette = loadJSON(url);
}

/* TODO:
*  for the vectors that have a z-axis, I need to remove them manually
*
* https://www.reddit.com/r/generative/comments/17fx7ew/playing_with_flow_field_effects_lines_are_drawn/
* I could also adjust the colours inside a single particle depending on the position
* */
function setup() {
    flowState = noField;
    // picks a random field
    flowFieldShuffle();

    // scale factor
    let magnifier = 5;
    canvasWidth = canvasWidth * magnifier;
    canvasHeight = canvasHeight * magnifier;
    //canvasHeight = 480;
    pixelSize = pixelSize * magnifier;

    /* rng values for the flowfield that modify the whole board */
    if ( flowState !== spinField) {
        scale = floor(random(6, 20));
    }  else {
        scale = floor(random(20, 40));
    }
    /* rng values end */

    // shuffle for particle mode
    let shuffle = floor(random(0, 2));
    if (shuffle === 0) {
        backgroundInclusion = true;
    }

    // calls upon colour palette
    palettePicker();

    createCanvas(canvasWidth, canvasHeight);
    pixelDensity(1); // one px per px

    // dividing the canvas into cols and rows
    cols = floor(width / scale);
    rows = floor(height / scale);

    // creating the flowfield
    flowField = new Flowfield(cols*rows);

    // setting up quadtree
    qtree = new Quadtree({
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight
    })

    // different modes
    if (backgroundInclusion === true) {
        particleNumber = particleNumber*2;
        for (i = 0; i < particleNumber; i++) {
            do {
                secondParticle[i] = new SecondParticle( width, height, pixelSize, 0);
            } while (particleOverlap(secondParticle[i].pos, pixelSize, particles.concat(secondParticle), qtree));
            //qtree.insert(secondParticle[i]);
        }
    } else {
        for (i = 0; i < particleNumber; i++) {
            do {
                secondParticle[i] = new SecondParticle(width, height, pixelSize, 1);
            } while (particleOverlap(secondParticle[i].pos, pixelSize, particles.concat(secondParticle), qtree));
            //qtree.insert(secondParticle[i]);

        }
        for (i = 0; i < particleNumber; i++) {
            do {
                particles[i] = new Particle(width, height, pixelSize, 2);
            } while (particleOverlap(particles[i].pos, pixelSize, secondParticle.concat(particles), qtree));
            //qtree.insert(particles[i]);
        }
    }

    // for collision
    particleCollection = particles + secondParticle;

    // setting the body bg according to palette colour picked
    document.body.style.backgroundColor = paletteOne;

    // show pixelgrid or not
    pixelGridShuffle();

    // manual refresh
    let refreshBtn = document.getElementById('refreshPage');
    refreshBtn.style.backgroundColor = paletteTwo;
    refreshBtn.style.color = paletteOne;
    refreshBtn.addEventListener("click", function () {
        location.reload();
    });
}

function flowFieldShuffle() {
    let shuffle = floor(random(0, 3));
    switch(shuffle) {
        case 0:
            flowState = classicField;
            console.log("classicField");
            return flowState;
        case 1:
            flowState = waveField;
            console.log("waveField");
            return flowState;
        case 2:
            flowState = spinField;
            console.log("spinField");
            return flowState;
        case 3:
            flowState = funkyField;
            console.log("funkyField");
            return flowState;
    }
}




function pixelGridShuffle() {
    let pixelGridShuffle = floor(random(0, 2));
    if (pixelGridShuffle === 0) {
        pixelGridInclusion = true;
    }
}

function draw() {
    invokeShuffledFlowfield();

    qtree.clear();    // clearing quadtree with each draw

    // for the different modes
    if (backgroundInclusion === true) {
        background(paletteOne);
    } else {
        particleInvokation(paletteOne, particles);
    }

    // gets called regardless of mode
    particleInvokation(paletteTwo, secondParticle);

    fillAgain(secondParticle);
    // checking for particle collision
    collisionDetection(secondParticle);
    collisionDetection(particles);

    // show quadtree
    //qtree.show(this);
    if (pixelGridInclusion === true && backgroundInclusion === true) {
        fillGrid();
    }
}

// messed around with different flow fields, picks one randomly
function invokeShuffledFlowfield() {
    switch (flowState) {
        case classicField:
            flowField.invokeField(
                angleModifier = random(1.5, 2),
                magnitude = random(0.4, 2)
            );
            break;
        case waveField:
            flowField.invokeWaveField(
                magnitude = random(0.04, 0.1)
            );
            break;
        case spinField:
            flowField.invokespinField(

            );
            break;
        case funkyField:
            flowField.invokefunkyField();
            break;
    }
}

// note: part = particle
function fillAgain(part) {
    for( let i = 0; i < part.length; i++ ) {
        qtree.insert(part[i].pos.x, part[i].pos.y);
    }
}
function fillGrid() {
    for (let x = 0; x < canvasWidth; x += pixelSize) {
        for (let y = 0; y < canvasHeight; y += pixelSize) {
            noFill();

            colorMode(RGB, 255, 255, 255, 1);
            stroke(255, 0.008);
            strokeWeight(1);
            rect(x, y, pixelSize, pixelSize);
        }
    }
}

function collisionDetection(part) {
    for (let i = 0; i < part.length; i++) {
        const collisionParticles = part[i];

        const candidates = qtree.retrieve({
            x: collisionParticles.pos.x,
            y: collisionParticles.pos.y,
            width: collisionParticles.size,
            height: collisionParticles.size
        });
        //console.log(candidates);
        // https://timohausmann.github.io/quadtree-js/many.html

        for ( let k = 0; k < candidates.length; k++) {
            const myCandidate = candidates[k];
            const intersect = getIntersection(collisionParticles, myCandidate);

            // if they collide push them away
            if (intersect) {
                myCandidate.pos = createVector(myCandidate.x, myCandidate.y);

                //const moveVector = intersect.pushVector.copy().mult(.5); // should probably store this as a parameter but it basically is responsible for how far the colliding vectors will jump away from each other
                const moveVector = intersect.pushVector.copy().mult(.25); // should probably store this as a parameter but it basically is responsible for how far the colliding vectors will jump away from each other
                //moveVector.limit(.25);
                collisionParticles.pos.sub(moveVector);

                myCandidate.pos.sub(moveVector);
                //used to be:
                //myCandidate.pos.sub(moveVector);

            }
        }
    }
}

function getIntersection(particle1, particle2) {
    // https://github.com/timohausmann/quadtree-js/blob/master/docs/many.html
    const r1 = particle1.size / 2,
        r2 = particle2.height / 2,
    p1x = particle1.pos.x;
    p1size = particle1.size;
    p1y = particle1.pos.y;
    p2x = particle2.x;
    p2size = particle2.height;
    p2y = particle2.y;

    // currently the distance is just checking for pos1 vs pos2, but I should probably
    // add the other parameters too for more accurate collision
    const distance = dist(p1x+p1size, p1y+p1size, p2x+p2size, p2y+p2size);

    if (distance < r1 + r2) {
        // Calculate the push amounts and directions

        const pushX = (p1size + p2size) - distance;
        const dir = createVector(particle2.x - particle1.pos.x, particle2.y - particle1.pos.y).normalize();
        const pushVector = dir.mult(p1size + p2size);


   /*     setTimeout(() => {
            debugger
        }, 100);
*/
        return {
            pushVector: pushVector
        };
    } else {
        return false;
    }
}

function particleInvokation(colour, particles) {
    for (i = 0; i < particles.length; i++) {
        particles[i].follow(flowField);
        particles[i].update();
        particles[i].edges();
        particles[i].show(colour); // passes colour variables as parameters
        // Insert the particle into the quadtree
        qtree.insert({
            x: particles[i].pos.x,
            y: particles[i].pos.y,
            width: pixelSize,
            height: pixelSize
        });
    }
}

// Function to check if a particle overlaps with existing particles in the quadtree
function particleOverlap(newPos, size, particleArray, qtree) {
    const range = new Rectangle(newPos.x, newPos.y, size, size);
    const particlesInRange = qtree.retrieve(range);

    for (let i = 0; i < particlesInRange.length; i++) {
        const otherParticle = particlesInRange[i];
        const d = dist(newPos.x, newPos.y, otherParticle.pos.x, otherParticle.pos.y);
        if (d < size && particleArray.indexOf(otherParticle) === -1) {
            return true; // Overlapping with an existing particle
        }
    }

    return false; // Not overlapping with any existing particle
}

function palettePicker() {
    // dynamically grabbing the length of the palette json, so I can keep adding or removing palettes
    let paletteCount = Object.keys(palette).length;

    // shuffling through the json
    let paletteChoice = floor(random(0, paletteCount));

    for ( const item in palette[paletteChoice]) {
        if(item == 0) {
            paletteOne = "#" + palette[paletteChoice][item];
        } else {
            paletteTwo = "#" + palette[paletteChoice][item];
        }
    }

    // swapping spots between the colours
    let paletteInvert = floor(random(0, 2));
    if ( paletteInvert === 0) {
        paletteOne = [paletteTwo, paletteTwo = paletteOne][0];
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
* */

