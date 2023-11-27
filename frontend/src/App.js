import ChatWindow from './components/Layout/ChatWindow';
import ChatProvider from './store/ChatProvider';

function App() {
  return <ChatProvider>
    <ChatWindow />
  </ChatProvider>;
}

export default App;
