import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';
import logo from './../../../static/images/sky0.png';

import { useEffect, useRef } from 'react';
import { useContext, useEffect, useState } from 'react';

import React from 'react';
import { ApiContext } from '../../utils/api_context';

import steak from '../../../static/images/icons/steak.png';
import twowaymon1 from '../../../static/images/mon1/twowaymon.png';
import twowaymon2 from '../../../static/images/mon2/twowaymon.png';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';

// Thank you StackOverflow
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
//distInKm is max distance away
function isCloseEnough(lat1, lon1, lat2, lon2, distInKm) {
  dist = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2); //actual distance from chatroom
  if (dist > distInKm) {
    return false;
  } else {
    return true;
  }
}

export const Home = () => {
  const api = useContext(ApiContext);
  // const navigate = useNavigate();

  const [chatRooms, setChatRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lat, setLat] = useState([]);
  const [lng, setLng] = useState([]);

  const ref = useRef();
  const [isDropping, setIsDropping] = useState(false);
  // const [user, setUser] = useState(null);
  // const api = useContext(ApiContext);
  const [monsterImport, setMonsterImport] = useState(null);
  // Get how much food the player account needs
  const [hunger, setHunger] = useState(null);
  const [maxhunger, setMaxhunger] = useState(null);

  let eaten = 0;

  useEffect(async () => {
    if (!user) {
      const { user } = await api.get('/users/me');
      setUser(user);
      //console.log(user);
      setHunger(user.currhunger);
      setMaxhunger(user.maxhunger);
      monsterName = user.monsterName;
      if (monsterName == 'mon1') {
        setMonsterImport(twowaymon1);
      } else if (monsterName == 'mon2') {
        setMonsterImport(twowaymon2);
      } else {
        setMonsterImport(twowaymon1);
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
      angleMath();
    }

    // async function demo() {
    //   for (let i = 0; i < 5; i++) {
    //     // console.log(`Waiting ${i} seconds...`);
    //     await sleep(i * 1000);
    //   }
    //   //console.log('Done');
    //   let minimumX = 30;
    //   let maximumX = 280 - 30;
    //   mouseX = Math.floor(Math.random() * (maximumX - minimumX + 1)) + minimumX;
    // }

    // demo();

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
      let minimumX = 30;
      let maximumX = 280 - 30;
      mouseX = Math.floor(Math.random() * (maximumX - minimumX + 1)) + minimumX;
      mouseY = e.offsetY;
    }

    // function dropSteak() {
    //   // if (isDropping === true) {
    //   let deltaSteakY = 1;
    //   if (steakYpos + deltaSteakY >= 0 && steakYpos + SCALED_STEAK_HEIGHT + deltaSteakY < canvas.height) {
    //     steakYpos += STEAKDROPSPEED * deltaSteakY * STEAK_SCALE;
    //     // console.log("Steak y:", steakYpos);
    //   }
    //   // }
    // }

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

  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    await geolocation();

    await chatRooms.forEach((chatRoom) => {
      const chatRoomsList = [];
      console.log('chatroom stuff ', chatRoom.latitude, chatRoom.longitude);
      console.log('latlng stuff ', { lat }.lat, { lng }.lng);
      console.log(
        'distance in km: ',
        getDistanceFromLatLonInKm(chatRoom.latitude, chatRoom.longitude, { lat }.lat, { lng }.lng),
      );
      console.log('chatRoom.latitude: ', chatRoom.latitude);
      console.log('lat: ', { lat });
      if (isCloseEnough(chatRoom.latitude, chatRoom.longitude, { lat }.lat, { lng }.lng, 1)) {
        // 0.1 km is about 330 feet
        console.log('Close Enough: True');
        chatRoomsList.push(chatRoom);
      }
      setChatRooms(chatRoomsList);
    });

    console.log(chatRooms);
    setUser(res.user);
    setLoading(false);
  }, [lat, lng]);

  if (loading) {
    return <div>Loading...</div>;
  }

  async function geolocationlog() {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
    });
  }

  async function geolocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lati = position.coords.latitude;
      const lngi = position.coords.longitude;
      console.log(lati + ' ' + lngi);
      setLat(lati);
      setLng(lngi);
    });
  }

  const createRoom = async (name, lat, lng) => {
    setIsOpen(false);
    const { chatRoom } = await api.post('/chat_rooms', { name, lat, lng });
    setChatRooms([...chatRooms, chatRoom]);
  };

  const closeModal = async () => {
    setIsOpen(false);
    setChatRooms([...chatRooms]);
  };

  return (
    <div className="container">
      <Rooms>
        {chatRooms.map((room) => {
          return (
            <Room
              key={room.id}
              name={room.name}
              lat={room.latitude}
              lng={room.longitude}
              to={`chat_rooms/${room.id}`}
            ></Room>
          );
        })}
        <Room action={() => setIsOpen(true)}>+</Room>
        <Button className="updateBtn" onClick={() => geolocation()}>
          Update Location
        </Button>
        <Button>{<Link to="/planet">Go To Planet</Link>}</Button>
      </Rooms>
      <div className="chat-window">
        <Routes>
          {/* <Route path="planet" element={<div>G</div>}/> */}
          <Route path="chat_rooms/:id" element={<ChatRoom />} />
          <Route path="/*" element={<div>Select a room to get started</div>} />
        </Routes>
      </div>
      <div className="home_canvas_div">
        <canvas id="home_canvas" ref={ref}></canvas>
      </div>
      {/* <img src={logo} alt="Italian Trulli" className="worldimg"></img> */}
      {isOpen ? <NewRoomModal createRoom={createRoom} closeModal={closeModal} /> : null}
    </div>
  );
};
