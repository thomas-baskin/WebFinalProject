import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';

import { Button } from '../common/button';
import { useMessages } from '../../utils/use_messages';
import { Message } from './message';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();
  const [messages, sendMessage] = useMessages(chatRoom);
  useEffect(async () => {
    setLoading(true);
    if (!user) {
      const { user } = await api.get('/users/me');
      setUser(user);
    }
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
  }, [id]);

  if (loading) return 'Loading...';

  //Thank you Pluralsight for your tutorial.
  // componentDidMount()
  // {
  //   navigator.geolocation.getCurrentPosition(function(position){
  //     console.log("Latitude is :", position.coords.latitude);
  //     console.log("Longitude is :", position.coords.longitude);
  //   });
  // }

  async function geolocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
    });
  }

  return (
    <div className="chat-container">
      <div>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div>
        <input type="text" value={contents} onChange={(e) => setContents(e.target.value)} />
        <Button onClick={() => sendMessage(contents, user)}>Send</Button>
        <Button onClick={() => geolocation()}>Geolocate</Button>
      </div>
    </div>
  );
};

//apiKey: 'AIzaSyCEJyBEm51-6F136X-7LHt3P6mzloabuTQ',
