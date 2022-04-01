import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';
import MapWrapper from '../chat_room/othermap';

export const Home = () => {
  const api = useContext(ApiContext);
  // const navigate = useNavigate();

  const [chatRooms, setChatRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    //   const rooms = chatRooms.filter([chatRoom])
    // chatRooms.forEach((chatRoom) => {
    //   if (iscloseenough) {
    //     setChatRooms([...chatRooms, chatRoom]);
    //   }
    // });
    console.log(chatRooms);
    setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async (name) => {
    setIsOpen(false);
    const { chatRoom } = await api.post('/chat_rooms', { name });
    setChatRooms([...chatRooms, chatRoom]);
  };
  // const { chatRooms } = await api.get('/chat_rooms');
  // import { Wrapper, Status } from "@googlemaps/react-wrapper";
  // const render = (status: Status) => {
  //   return <h1>{status}</h1>;

  return (
    <div className="container">
      {/* <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.14.1/build/ol.js"></script> */}
      <Rooms>
        {chatRooms.map((room) => {
          return (
            <Room key={room.id} to={`chat_rooms/${room.id}`}>
              {room.name}
            </Room>
          );
        })}
        <Room action={() => setIsOpen(true)}>+</Room>
      </Rooms>
      <div className="chat-window">
        <Routes>
          <Route path="chat_rooms/:id" element={<ChatRoom />} />
          <Route path="/*" element={<div>Select a room to get started</div>} />
        </Routes>
      </div>
      {isOpen ? <NewRoomModal createRoom={createRoom} /> : null}
      {/* <script
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCEJyBEm51-6F136X-7LHt3P6mzloabuTQ&callback=initMap"
      ></script>
      <div id="map"></div> */}

      {/* <GoogleApiWrapper></GoogleApiWrapper> */}
      {/* <MapComp></MapComp> */}
      {/* <MapWrapper></MapWrapper> */}
    </div>
  );
};
