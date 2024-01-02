import logo from './logo.svg';
import './App.css';

import Seneca from 'seneca-browser'
import SenecaEntity from 'seneca-entity'

let seneca = new Seneca({
  log: { logger: 'flat', level: 'warn' },
  plugin: {
    browser: {
      endpoint: '/api',
    }
  },
  timeout: 44444,
})

seneca
  .test()
  .use(SenecaEntity)
  .ready(async function() {
    const seneca = this
    console.log('SENECA READY', seneca)
    window.seneca = seneca
  })


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
