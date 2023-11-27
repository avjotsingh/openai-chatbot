import classes from "./ChatWindow.module.css";
import Header from "./Header";
import ChatHistory from "../Chat/ChatHistory";
import ChatInput from "../Input/ChatInput";
import ContextPane from "../Context/ContextPane";

const ChatWindow = (props) => {
  return <div className={classes['chat-window']}>
    <div className={classes['chat-container']}>
      <div className={classes['chats']}>
        <Header />
        <ChatHistory />
        <ChatInput />
      </div>
      <div className={classes['pdfs']}>
        <ContextPane />
      </div>
    </div>
  </div>
}

export default ChatWindow;