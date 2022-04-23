import { useState } from 'react';
import { Button } from '../common/button';
import { Home } from './_home';
import { useContext, useEffect, useState } from 'react';

export const NewRoomModal = ({ createRoom, closeModal }) => {
  const [name, setName] = useState('');
  const [lat, setLat] = useState([]);
  const [lng, setLng] = useState([]);

  useEffect(async () => {
    geolocation();
  }, []);

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

  return (
    <>
      <div className="overlay" onClick={() => closeModal()} />
      <div className="modal-container">
        <div className="modal">
          <span className="title">Create New Chat Room</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <p>Longitude: {lng}</p>
          <p>Latitude: {lat}</p>
          {/* <input type="number" value={lat} onChange={(e) => setLat(e.target.value)} /> */}
          <div className="button-container">
            <Button onClick={() => closeModal()}>Close</Button>
            <Button onClick={() => createRoom(name, lat, lng)}>Create</Button>
          </div>
        </div>
      </div>
    </>
  );
};
