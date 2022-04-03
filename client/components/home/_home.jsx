import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';
import MapWrapper from '../chat_room/othermap';

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
  const [latlngValidation, setLatLngValidation] = useState(false);
  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    await geolocation();
    // console.log('geolocation found');

    // const rooms = chatRooms.filter([chatRoom])

    // const [state, setState] = useState(0);
    // useEffect(() => {
    //   console.log(state);
    // }, [state]);
    // return (
    //   <button onClick={() => setState((prev) => prev + 1)}>
    //     {state}
    //     increment
    //   </button>
    // );

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
        // setChatRooms([...chatRooms, chatRoom]);
        chatRoomsList.push(chatRoom);
      }
      setChatRooms(chatRoomsList);
    });

    // navigator.geolocation.getCurrentPosition(function (position) {
    //   setLat(position.coords.latitude);
    //   setLng(position.coords.longitude);
    // });
    console.log(chatRooms);
    // setChatRooms(chatRooms);
    setUser(res.user);
    setLoading(false);
  }, [lat, lng]);

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
      // console.log('Latitude is :', position.coords.latitude);
      // console.log('Longitude is :', position.coords.longitude);
      //return { lat, lng };
    });
  }

  // useEffect(() => {
  //   // action on update of lat
  //   updateLocation();
  // }, [lat]);

  // function updateLocation2() {
  //   if (this.lat === 'undefined') {
  //     setLatLngValidation(true);
  //   } else {
  //     setLatLngValidation(false);
  //   }
  // }

  // const updateLocation = async () => {
  //   const res = await api.get('/users/me');
  //   const { chatRooms } = await api.get('/chat_rooms');
  //   // const result = await geolocation();
  //   await console.log(this.lat);
  //   await console.log(this.lng);
  //   // chatRoomsList = [];
  //   await updateRooms(chatRooms, this.lat, this.lng);
  // chatRooms.forEach((chatRoom) => {
  //   console.log('distance in km: ', getDistanceFromLatLonInKm(chatRoom.latitude, chatRoom.longitude, lat, lng));
  //   console.log('chatRoom.latitude: ', chatRoom.latitude);
  //   console.log('lat: ', this.lat);
  //   if (isCloseEnough(chatRoom.latitude, chatRoom.longitude, this.lat, this.lng, 0.001)) {
  //     // 0.1 km is about 330 feet
  //     console.log('Close Enough: True');
  //     chatRoomsList.append(chatRoom);
  //     setChatRooms([...chatRooms, chatRoom]);
  //   }
  //   // console.log(chatRoomsList);
  //   // setChatRooms(chatRoomsList);
  // });
  // setUser(res.user);
  // setLoading(false);
  // do something else here after firstFunction completes
  // };

  // const updateRooms = async (chatRooms, latit, longit) => {
  //   await chatRooms.forEach((chatRoom) => {
  //     console.log('distance in km: ', getDistanceFromLatLonInKm(chatRoom.latitude, chatRoom.longitude, latit, longit));
  //     console.log('chatRoom.latitude: ', chatRoom.latitude);
  //     console.log('lat: ', latit);
  //     if (isCloseEnough(chatRoom.latitude, chatRoom.longitude, latit, longit, 0.001)) {
  //       // 0.1 km is about 330 feet
  //       console.log('Close Enough: True');
  //       // chatRoomsList.append(chatRoom);
  //       setChatRooms([...chatRooms, chatRoom]);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (!latlngValidation) {
  //     updateLocation();
  //   }
  // }, [latlngValidation]);

  // async function updateLocation() {
  // const res = await api.get('/users/me');
  // const { chatRooms } = await api.get('/chat_rooms');
  // await geolocation();
  // console.log(this.lat);
  // console.log(this.lng);
  // chatRoomsList = [];
  // await chatRooms.forEach((chatRoom) => {
  //   console.log('distance in km: ', getDistanceFromLatLonInKm(chatRoom.latitude, chatRoom.longitude, lat, lng));
  //   console.log('chatRoom.latitude: ', chatRoom.latitude);
  //   console.log('lat: ', this.lat);
  //   if (isCloseEnough(chatRoom.latitude, chatRoom.longitude, this.lat, this.lng, 1000000)) {
  //     // 0.1 km is about 330 feet
  //     console.log('Close Enough: True');
  //     chatRoomsList.append(chatRoom);
  //     // setChatRooms([...chatRooms, chatRoom]);
  //   }
  //   // console.log(chatRoomsList);
  //   setChatRooms(chatRoomsList);
  // });
  // return -1;
  // setUser(res.user);
  // setLoading(false);
  // }

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
