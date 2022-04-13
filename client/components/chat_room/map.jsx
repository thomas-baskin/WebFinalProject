import React, { Component } from 'react';

export const MapComp = (props) => {
  return (
    <div className="map">
      <Map
        google={props.google}
        zoom={10}
        initialCenter={{
          lat: 40,
          lng: 10,
        }}
      ></Map>
    </div>
  );
};
