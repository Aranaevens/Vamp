import App from "./components/App";
import {BrowserRouter} from "react-router-dom";
import { render } from 'react-dom'
import React from "react";
import ReactDOM from 'react-dom';

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));