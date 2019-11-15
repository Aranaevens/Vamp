import App from "./components/App";
import {BrowserRouter} from "react-router-dom";
import { render } from 'react-dom'
import React from "react";
import 'antd/dist/antd.less'
import '../static/frontend/site.css';


render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));