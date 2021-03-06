import { useEffect, useRef } from 'react';
import { useContext, useEffect, useState } from 'react';

import React from 'react';
import { ApiContext } from '../../utils/api_context';

import icoexercise64 from '../../../static/images/icons/icoexercise64.png';
import icofood64 from '../../../static/images/icons/icofood64.png';
import steak from '../../../static/images/icons/steak.png';
import greensteak from '../../../static/images/icons/greensteak.png';
import darksteak from '../../../static/images/icons/darksteak.png';
import twowaymon1 from '../../../static/images/mon1/twowaymon.png';
import twowaymon2 from '../../../static/images/mon2/twowaymon.png';
import twowaymon3 from '../../../static/images/mon3/twowaymon.png';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';

export const Planet = () => {
  const ref = useRef();
  const [isDropping, setIsDropping] = useState(false);
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const [monsterImport, setMonsterImport] = useState(null);
  // Get how much food the player account needs
  const [hunger, setHunger] = useState(null);
  const [maxhunger, setMaxhunger] = useState(null);

  let eaten = 0;

  useEffect(async () => {
    if (!user) {
      const { user } = await api.get('/users/me');
      setUser(user);
      console.log(user);
      setHunger(user.currhunger);
      setMaxhunger(user.maxhunger);
      monsterName = user.monsterName;
      if (monsterName == 'mon1') {
        setMonsterImport(twowaymon1);
      } else if (monsterName == 'mon2') {
        setMonsterImport(twowaymon2);
      } else if (monsterName == 'mon3') {
        setMonsterImport(twowaymon3);
      }
      // Had issues with dynamically importing files so I'll download them all and only use one
      // There isn't enough time to be picky.
      // const monsterImport = await import(`../../../static/images/${monsterName}/twowaymon.png`).default;
    }
    // const res = await api.get('/users/me');
    const canvas = ref.current;
    // canvas.requestFullscreen();
    // canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    // canvas.requestPointerLock();
    const ctx = canvas.getContext('2d');

    const STEAKDROPSPEED = 0.4;
    let steakYpos = 0;
    let minimumX = 30;
    let maximumX = 280 - 30;
    let steakXpos = Math.floor(Math.random() * (maximumX - minimumX + 1)) + minimumX;
    const SCALED_STEAK_HEIGHT = 10;
    const SCALED_STEAK_WIDTH = 30;
    const STEAK_SCALE = 0.5;

    let SCALE = 2.5;
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
    let MOVEMENT_SPEED = 0.4;

    ctx.imageSmoothingEnabled = false;
    //choose initial sprite
    let currentDirection = WEST;
    let currentLoopIndex = 0;
    let frameCount = 0;
    //coordinates of character, based on top left corner of sprite
    let positionX = 0;
    let positionY = 117;
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
      if (currentDirection == WEST) {
        if (Math.abs(positionX - steakXpos) < 25 && steakYpos >= 125) {
          steakYpos = 0;
          steakXpos = Math.floor(Math.random() * (maximumX - minimumX + 1)) + minimumX;
          if (isDropping === true) {
            setHunger(hunger - 1);
            setIsDropping(false);
          }
        }
      } else {
        if (Math.abs(positionX + 25 - steakXpos) < 25 && steakYpos >= 125) {
          steakYpos = 0;
          steakXpos = Math.floor(Math.random() * (maximumX - minimumX + 1)) + minimumX;
          if (isDropping === true) {
            setHunger(hunger - 1);
            setIsDropping(false);
          }
        }
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
      if (isDropping === true) {
        dropSteak();
        ctx.drawImage(img2, steakXpos, steakYpos, SCALED_STEAK_WIDTH, SCALED_STEAK_HEIGHT);
      }
      window.requestAnimationFrame(drawLoop);
    }

    //load the spritesheet and run the animation
    function runPlayerAnimation() {
      img.src = monsterImport;
      img2.src = steak;
      img.onload = function () {
        window.requestAnimationFrame(drawLoop);
      };
    }

    runPlayerAnimation();
  }, [isDropping]);

  const renderSteak = () => {
    let td = [];
    let counter = 1;
    for (let i = 1; i <= hunger; i++) {
      td.push(<img src={steak} alt="blug" title={'Red is bad! ' + i} className="hunger"></img>);
      counter += 1;
    }
    for (let j = counter; j <= maxhunger; j++) {
      td.push(<img src={darksteak} alt="blug" title={'Black is good! ' + j} className="darkhunger"></img>);
    }
    return td;
  };

  useEffect(async () => {
    renderSteak();
  }, [hunger]);

  return (
    <div>
      <div id="hungerBar">{renderSteak()}</div>
      <div>
        {/* <img src={darksteak}></img>
        <img src={steak}></img> */}
        {/* <img src={greensteak} title="Three Bad Steaks =/= Good"></img> */}
      </div>
      <div id="planet_div">
        <canvas id="planet_canvas" ref={ref}></canvas>
        <div className="buttonDiv">
          <button className="icobtn" onClick={() => setIsDropping(!isDropping)} disabled={isDropping}>
            <img className="icobtnimg" src={icofood64}></img>
          </button>
          <button className="icobtn" title="Disabled" disabled={true}>
            <img className="icobtnimg" src={icoexercise64}></img>
          </button>
          {/* <Monster img={mon1}></Monster> */}
        </div>
      </div>
      <div className="chatroombtn">
        <Button>{<Link to="/home">Go To Chatrooms</Link>}</Button>
      </div>
    </div>
  );
};

export const Steaks = ({ children }) => {
  return <div className="side-bar">{children}</div>;
};
