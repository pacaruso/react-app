//import { createRoot } from 'react-dom/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { FlagProvider } from '@unleash/proxy-client-react';


/* const config = {
  url: 'https://app.unleash-hosted.com/demo/api/frontend', // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
  clientKey: 'demo-app:dev.95ae66ab673bf467facb68b2487904f4891064d26b47e89ca498063d', // A client-side API token OR one of your proxy's designated client keys (previously known as proxy secrets)
  refreshInterval: 15, // How often (in seconds) the client should poll the proxy for updates
  appName: 'codesandbox-react', // The name of your application. It's only used for identifying your application
}; */


const root = ReactDOM.createRoot(document.getElementById('root'));
//const root = createRoot(document.getElementById('root'));
/* root.render(
  <React.StrictMode>
    <FlagProvider config={config}></FlagProvider>
    <App />
  </React.StrictMode>
); */
//    <FlagProvider config={config}></FlagProvider>
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
root.render(
  <React.StrictMode>
    <FlagProvider
      config={{
        url: "https://app.unleash-hosted.com/demo/api/frontend", // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
        clientKey:
          "demo-app:dev.95ae66ab673bf467facb68b2487904f4891064d26b47e89ca498063d", // A client-side API token OR one of your proxy's designated client keys
        refreshInterval: 15, // How often (in seconds) the client should poll the proxy for updates
        appName: "codesandbox-react", // The name of your application. It's only used for identifying your application
      }}
    >
      <App />
    </FlagProvider>
  </React.StrictMode>
);
reportWebVitals();
