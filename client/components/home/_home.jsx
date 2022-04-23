import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';
import logo from './../../../static/images/sky0.png';

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
      </Rooms>
      <div className="chat-window">
        <Routes>
          <Route path="chat_rooms/:id" element={<ChatRoom />} />
          <Route path="/*" element={<div>Select a room to get started</div>} />
        </Routes>
      </div>
      <img src={logo} alt="Italian Trulli" className="worldimg"></img>
      {isOpen ? <NewRoomModal createRoom={createRoom} closeModal={closeModal} /> : null}
    </div>
  );
};
