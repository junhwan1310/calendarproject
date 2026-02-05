// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux"; // Redux를 React에 연결해주는 컴포넌트
import store from "./redux/config/configStore"; // 우리가 만든 Redux 스토어 로드
import App from './App.jsx' // 메인 App 컴포넌트 로드
import './style.css' // 전역 스타일시트 로드

ReactDOM.createRoot(document.getElementById('root')).render( // HTML 내 root 엘리먼트에 렌더링
  <React.StrictMode> {/* 개발 시 잠재적인 문제를 체크하는 모드 */}
    <Provider store={store}> {/* 전체 앱에서 Redux 스토어를 사용할 수 있게 감싸줌 */}
      <App />
    </Provider>
  </React.StrictMode>
)
