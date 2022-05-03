import { Monster } from './monster';
import { useEffect, useRef } from 'react';
import { useContext, useEffect, useState } from 'react';

import React from 'react';
import twowaymon3 from '../../../static/images/mon1/twowaymon3.png';
import icoexercise64 from '../../../static/images/icons/icoexercise64.png';
import icofood64 from '../../../static/images/icons/icofood64.png';
import steak from '../../../static/images/icons/steak.png';

export const Planet = () => {
  const ref = useRef();
  const [isDropping, setIsDropping] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');

    const STEAKDROPSPEED = 0.4;
    let steakYpos = 0;
    let minimumX = 0;
    let maximumX = 280;
    let steakXpos = Math.floor(Math.random() * (maximumX - minimumX + 1)) + minimumX;
    const SCALED_STEAK_HEIGHT = 10;
    const SCALED_STEAK_WIDTH = 20;
    const STEAK_SCALE = 0.5;

    let SCALE = 3;
    //define width and height based on source image
    const WIDTH = 8;
    const HEIGHT = 12;
    const SCALED_WIDTH = SCALE * WIDTH * 4;
    const SCALED_HEIGHT = SCALE * HEIGHT;
    //animation has 8 frames per row
    const CYCLE_LOOP = [0, 1, 2, 3, 4, 5, 6, 7];
    //rows of spritesheet
    const EAST = 0;
    const WEST = 1;
    //Determines framerate of animation, lower numbers being faster
    const FRAME_LIMIT = 8;
    //Determines speed at which character moves
    let MOVEMENT_SPEED = 0.25;

    ctx.imageSmoothingEnabled = false;
    //choose initial sprite
    let currentDirection = WEST;
    let currentLoopIndex = 0;
    let frameCount = 0;
    //coordinates of character, based on top left corner of sprite
    let positionX = 0;
    let positionY = 112;
    //coordinates of mouse
    let mouseX;
    let mouseY;
    //start with mouse outside of canvas
    let mousePresent = false;
    //create a new image, later we will set the source as the spritesheet
    let img = new Image();
    let img2 = new Image();
    //difference between mouse and character's positions
    let xD = 0;
    let yD = 0;
    //angle of the mouse relative to the character
    let angle = 0;
    //length of the vector from character to mouse
    let hypotenuse = 0;
    let moving = false;

    function angleMath() {
      //base movement off of offset character coordinates to center      head of character
      xD = mouseX - (positionX + SCALED_WIDTH / 8);
      yD = mouseY - (positionY + SCALED_HEIGHT / 8);
      //get the angle of the mouse relative to the character
      angle = (Math.atan2(yD, xD) * 180) / Math.PI;
      //get the length of the vector from character to mouse
      hypotenuse = Math.hypot(xD, yD);
    }

    //Listen for mouse movement
    document.addEventListener('mousemove', mouseMoveListener);
    function mouseMoveListener(e) {
      //get mouse coordinates within the canvas
      mouseX = e.offsetX;
      mouseY = e.offsetY;
      angleMath();
    }

    //Listen for mouse presence
    document.addEventListener('mouseover', mouseOverListener);
    function mouseOverListener(e) {
      // console.log(mousePresent);
      mousePresent = true;
    }
    document.addEventListener('mouseout', mouseOutListener);
    function mouseOutListener(e) {
      mousePresent = false;
      // console.log(mousePresent);
      mouseoutX = mouseX;
      mouseoutY = mouseY;
    }

    function dropSteak() {
      // if (isDropping === true) {
      let deltaSteakY = 1;
      if (steakYpos + deltaSteakY >= 0 && steakYpos + SCALED_STEAK_HEIGHT + deltaSteakY < canvas.height) {
        steakYpos += STEAKDROPSPEED * deltaSteakY * STEAK_SCALE;
        // console.log("Steak y:", steakYpos);
      }
      // }
    }

    function moveCharacter() {
      let deltaX = xD / hypotenuse;
      let deltaY = 0;
      //collision with edge of canvas, doesn't accommodate collision with other objects inside canvas
      if (positionX + deltaX >= 0 && positionX + SCALED_WIDTH + deltaX <= canvas.width) {
        positionX += deltaX * MOVEMENT_SPEED * SCALE;
      }
      if (positionY + deltaY >= 0 && positionY + SCALED_HEIGHT + deltaY <= canvas.height) {
        positionY += deltaY * MOVEMENT_SPEED * SCALE;
      }
      //calling the angle math here adjusts character's movement even if mouse stops moving
      angleMath();

      // at steak
      if (Math.abs(positionX - steakXpos) < 15 && steakYpos >= 125) {
        // console.log('Trigger');
        steakYpos = 0;
        // setIsDropping(false);
      }
    }

    //draw a specific frame from the spritesheet
    function drawFrame(frameX, frameY, canvasX, canvasY) {
      ctx.drawImage(img, frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT, canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
      // ctx.drawImage(img,)
    }

    function drawLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // console.log(angle);
      //switch row of spritesheet for proper direction
      // switch (true) {
      if (xD < 0) {
        currentDirection = WEST;
      } else if (xD >= 0) {
        currentDirection = EAST;
      }

      //character stops when touching mouse
      switch (true) {
        case Math.abs(mouseX - xD) <= SCALED_WIDTH / 16 || mousePresent === false:
          moving = false;
          break;
        case Math.abs(mouseX - xD) > SCALED_WIDTH / 16 && mousePresent === true:
          moving = true;
          break;
      }
      //run animation
      if (moving === true) {
        moveCharacter();
        frameCount++;
        if (frameCount >= FRAME_LIMIT / MOVEMENT_SPEED) {
          frameCount = 0;
          currentLoopIndex++;
          if (currentLoopIndex >= CYCLE_LOOP.length) {
            currentLoopIndex = 0;
          }
        }
      }

      if (!moving) {
        currentLoopIndex = 0;
      }

      drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
      dropSteak();
      // if (isDropping === true) {
      //   console.log('isDropping: ', isDropping);
      ctx.drawImage(img2, steakXpos, steakYpos, SCALED_STEAK_WIDTH, SCALED_STEAK_HEIGHT);
      // }
      window.requestAnimationFrame(drawLoop);
    }

    //load the spritesheet and run the animation
    function runPlayerAnimation() {
      img.src = twowaymon3;
      img2.src = steak;
      // img2.style.visibility = isDropping;
      img.onload = function () {
        window.requestAnimationFrame(drawLoop);
      };
    }

    // function runSteakAnimation() {
    //   img.src = steak;
    //   img.onload = function () {
    //     window.requestAnimationFrame(drawLoop);
    //   };
    // }

    runPlayerAnimation();
    // runSteakAnimation();
    // do something here with the canvas
  }, []);
  // const canvas = React.createElement('canvas', {}, 'My First React Code');

  // var ctx = canvas.getContext('2d');

  //set scale
  return (
    <div id="planet_div">
      <canvas id="planet_canvas" ref={ref}></canvas>
      <button className="icobtn" onClick={() => setIsDropping(true)}>
        <img className="icobtnimg" src={icofood64}></img>
      </button>
      <button className="icobtn">
        <img className="icobtnimg" src={icoexercise64}></img>
      </button>
      {/* <Monster img={mon1}></Monster> */}
    </div>
  );
};
