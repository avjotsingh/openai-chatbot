import classes from "./Message.module.css";

const Message = (props) => {
  const classeNames = `${classes['message-container']} ${props.message.role === 'user' ? classes.user : classes.assistant}`
  return <div className={classeNames}>
      <div className={classes.message}>
        <p>{props.message.content}</p>
      </div>
  </div>
  
}

export default Message;