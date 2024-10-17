import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef, createRef } from 'react';
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import PerfectScrollbar from 'react-perfect-scrollbar'
import KanbanBoard from './pages/kanbanBoard';

function App() {

  return (
    <KanbanBoard />
  );
}

export default App;
