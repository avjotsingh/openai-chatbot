import { useReducer } from "react";
import ChatContext from "./chat-context";

const defaultChatState = {
  messages: [],
  userPrompt: '',
  awaitAIResponse: false,
  uploadedFiles: []
};

const chatReducer = (state, action) => {
  if (action.type === 'USER_MSG') {
    const newMessage = {
      role: 'user',
      content: action.message
    }

    return {
      messages: [...state.messages, newMessage],
      userPrompt: action.message,
      awaitAIResponse: true,
      uploadedFiles: state.uploadedFiles
    }
  } else if (action.type === 'ASSISTANT_MSG') {
    const newMessage = {
      role: 'assistant',
      content: action.message,
    }

    return {
      messages: [...state.messages, newMessage],
      userPrompt: state.userPrompt,
      awaitAIResponse: false,
      uploadedFiles: state.uploadedFiles
    }
  } else if (action.type === 'CONTEXT_FILES') {
    return {
      messages: state.messages,
      userPrompt: state.userPrompt,
      awaitAIResponse: state.awaitAIResponse,
      uploadedFiles: action.files
    }
  }

  return defaultChatState;
}

const ChatProvider = (props) =>  {
  const [chatState, dispatchChatAction] = useReducer(chatReducer, defaultChatState);

  const addUserMessage = message => {
    dispatchChatAction({
      type: 'USER_MSG',
      message
    })
  }

  const addAssistantMessage = message => {
    dispatchChatAction({
      type: 'ASSISTANT_MSG',
      message
    })
  }

  const setUploadedFiles = files => {
    
    dispatchChatAction({
      type: 'CONTEXT_FILES',
      files: files
    })
  }

  const chatContext = {
    ...chatState,
    addUserMessage,
    addAssistantMessage,
    setUploadedFiles
  }

  return <ChatContext.Provider value={chatContext}>
    { props.children }
  </ChatContext.Provider>
}

export default ChatProvider;