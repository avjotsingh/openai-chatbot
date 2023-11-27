import classes from "./ChatHistory.module.css";
import ChatContext from "../../store/chat-context";
import { useContext, useEffect, useRef } from "react";
import Message from "./Message";


const ChatHistory = (props) => {
  
  const chatCtx = useContext(ChatContext);
  const messages = chatCtx.messages;
  const chatHistoryRef = useRef();

  useEffect(() => {
    if (!chatCtx.awaitAIResponse) {
      if (chatHistoryRef.current.lastChild) {
        chatHistoryRef.current.lastChild.scrollIntoView({ behavior: 'smooth' })
      }
      
    }

  }, [chatCtx.awaitAIResponse])

  return <div className={classes['chat-history']} ref={chatHistoryRef}>
    {
      messages.map((message, i) => <Message key={i} message={message} />)
    }
  </div>
  
  
  
}

export default ChatHistory;