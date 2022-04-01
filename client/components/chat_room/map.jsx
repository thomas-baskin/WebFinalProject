import React, { Component } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
// export class MapComp extends Component {
export const MapComp = (props) => {
  // export const MapComp = ({ lat, lng }) => {
  return (
    <div className="map">
      {/* <script
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCEJyBEm51-6F136X-7LHt3P6mzloabuTQ&callback=initMap"
      ></script> */}
      {/* <Wrapper apiKey={'AIzaSyCEJyBEm51-6F136X-7LHt3P6mzloabuTQ'} render={render}> */}
      <Map
        google={props.google}
        zoom={10}
        initialCenter={{
          lat: 40,
          lng: 10,
        }}
      ></Map>
      {/* </Wrapper> */}
    </div>
  );
};

//export default MapComp;
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCEJyBEm51-6F136X-7LHt3P6mzloabuTQ',
})(MapComp);

// const render = (status: Status) => {
//   return <h1>{status}</h1>;
// };

// <Wrapper apiKey={'AIzaSyCEJyBEm51-6F136X-7LHt3P6mzloabuTQ'} render={render}>
//   <YourComponent />
// </Wrapper>;
