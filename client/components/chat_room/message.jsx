export const Message = ({ message }) => {
  return (
    <div className="message">
      <h3 className="user-name">{message.userName}</h3>
      <p className="message-content">{message.contents}</p>
    </div>
  );
};
