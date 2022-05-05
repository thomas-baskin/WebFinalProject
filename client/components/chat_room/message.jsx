import { useEffect, useState } from 'react';
import singlemon1 from '../../../static/images/mon1/singlemon.png';
import singlemon2 from '../../../static/images/mon2/singlemon.png';
import singlemon3 from '../../../static/images/mon3/singlemon.png';

export const Message = ({ message }) => {
  const [monsterImg, setMonsterImg] = useState(null);

  function setMonster() {
    // Get message with monster link
    monsterName = message.monsterName;
    if (monsterName == 'mon1') {
      setMonsterImg(singlemon1);
    } else if (monsterName == 'mon2') {
      setMonsterImg(singlemon2);
    } else if (monsterName == 'mon3') {
      setMonsterImg(singlemon3);
    }
  }

  useEffect(() => {
    setMonster();
  }, []);

  return (
    <div className="message">
      <h3 className="user-name">{message.userName}</h3>
      <img className="sprite" src={monsterImg} alt="blug"></img>
      <p className="message-content">{message.contents}</p>
    </div>
  );
};
