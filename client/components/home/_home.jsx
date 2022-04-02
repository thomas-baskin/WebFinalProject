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
  const [lat, setLat] = useState([]);
  const [lng, setLng] = useState([]);
  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    //   const rooms = chatRooms.filter([chatRoom])
    // chatRooms.forEach((chatRoom) => {
    //   if (iscloseenough) {
    //     setChatRooms([...chatRooms, chatRoom]);
    //   }
    // });
    // navigator.geolocation.getCurrentPosition(function (position) {
    //   setLat(position.coords.latitude);
    //   setLng(position.coords.longitude);
    // });
    geolocation();
    console.log(chatRooms);
    setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // function hide_overlay() {
  //   ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  // }

  // const MINUTE_IN_MS = 60000;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     geolocation();
  //   }, MINUTE_IN_MS);

  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, []);

  async function geolocationlog() {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
      //return { lat, lng };
    });
  }

  async function geolocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lati = position.coords.latitude;
      const lngi = position.coords.longitude;
      setLat(lati);
      setLng(lngi);
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
      //return { lat, lng };
    });
  }

  // const latlng = geolocation();
  // const lat = latlng.lat;
  // const lng = latlng.lng;

  const createRoom = async (name, lat, lng) => {
    setIsOpen(false);
    const { chatRoom } = await api.post('/chat_rooms', { name, lat, lng });
    setChatRooms([...chatRooms, chatRoom]);
  };

  const closeModal = async () => {
    setIsOpen(false);
    setChatRooms([...chatRooms]);
  };
  // const { chatRooms } = await api.get('/chat_rooms');
  // import { Wrapper, Status } from "@googlemaps/react-wrapper";
  // const render = (status: Status) => {
  //   return <h1>{status}</h1>;

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
      </Rooms>
      <div className="chat-window">
        <Routes>
          <Route path="chat_rooms/:id" element={<ChatRoom />} />
          <Route path="/*" element={<div>Select a room to get started</div>} />
        </Routes>
      </div>
      {isOpen ? <NewRoomModal createRoom={createRoom} closeModal={closeModal} /> : null}
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
