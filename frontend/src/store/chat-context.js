import React from 'react';

const ChatContext = React.createContext({
  messages: [],
  userPrompt: '',
  awaitAIResponse: false,
  uploadedFiles: [],
  addUserMessage: message => {},
  addAssistantMessage: message => {},
  setUploadedFiles: (files) => {}
});

export default ChatContext;