import Paths from './paths';
import Provider from 'pages/Provider';
import WhatsAppFloat from 'components/WhatsAppFloat';

function App() {
  return (
    <Provider>
      <Paths />
      <WhatsAppFloat />
    </Provider>
  );
}

export default App;
