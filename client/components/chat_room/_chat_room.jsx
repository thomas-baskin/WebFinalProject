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

  const [monsterImport, setMonsterImport] = useState(null);
  useEffect(async () => {
    setLoading(true);
    if (!user) {
      const { user } = await api.get('/users/me');
      setUser(user);
    }
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);

    // else {
    //   setMonsterImport(twowaymon1);
    // }

    setChatRoom(chatRoom);
    setLoading(false);
  }, [id]);

  if (loading) return 'Loading...';

  async function geolocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
    });
  }

  function sendAndClear(contents, user) {
    sendMessage(contents, user);
    setContents('');
  }

  return (
    <div className="chat-container">
      <div className="chatdiv">
        {messages.map((message) => (
          <div>
            <img src={monsterImport}></img>
            <Message key={message.id} message={message} />
          </div>
        ))}
        <input className="chatbar" type="text" value={contents} onChange={(e) => setContents(e.target.value)} />
        <Button onClick={() => sendAndClear(contents, user)}>Send</Button>
      </div>
    </div>
  );
};
