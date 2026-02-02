// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux"; // Redux Provider 추가
import store from "./redux/config/configStore"; // Store import
import App from './App.jsx'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
