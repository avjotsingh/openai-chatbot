import classes from "./ChatInput.module.css";
import { Fragment, useState } from "react";
import { useContext } from "react";
import ChatContext from "../../store/chat-context";


const ChatInput = (props) => {
  
  const [message, setMessage] = useState("");
  const chatCtx = useContext(ChatContext);

  const changeHandler = (event) => {
    const message = event.target.value;
    setMessage(message);
  }


  const submitHandler = async (event) => {
    event.preventDefault();
    if (!message) return;

    chatCtx.addUserMessage(message.trim());

    async function fetchAPIResponse() {
      try {
        const response = await fetch("http://localhost:8000/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: message
        })
      });

      setMessage("");

      const body = await response.json();
      const responseMessage = body.message;
      chatCtx.addAssistantMessage(responseMessage.trim());

      } catch (err) {
        console.log(err);
      }
    }

    fetchAPIResponse();  
  }

  return <Fragment>
    {
      chatCtx.awaitAIResponse && <div className={classes.typing}>Typing...</div>
    }
    <form className={classes['chat-input']} onSubmit={submitHandler}>
      <input type="text" 
        name="message" 
        value={message} 
        placeholder={"Type a message here and hit Enter..."} 
        onChange={changeHandler} />
    </form>
  </Fragment>

  
}

export default ChatInput;