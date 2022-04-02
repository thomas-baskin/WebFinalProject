import { Link } from 'react-router-dom';

export const Room = ({ name, lat, lng, to, action }) => {
  if (to) {
    return (
      <Link className="room" to={to}>
        <p className="asdf">
          {name} {lat} {lng}
        </p>
      </Link>
    );
  }
  if (action) {
    return (
      <button className="room action" onClick={action}>
        {'+'}
      </button>
    );
  }
  return null;
};
