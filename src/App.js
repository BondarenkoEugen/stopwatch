// import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import './App.css';
import { interval, fromEvent } from "rxjs";
import { debounceTime, map, buffer, filter } from "rxjs/operators";

function App() {

  const [time, setTime] = useState(0);
  const [isWait, setWait] = useState(true);

  const intervalObserver = interval(1000);

  useEffect(() => {
    if(!isWait){
      let timeObserver = intervalObserver.subscribe(() => setTime(time + 1))

      return () => timeObserver.unsubscribe();
    }
  });

  const handleWait = (e) => {
    const clickObserver = fromEvent(e.target, e.type);

    const doubleClickObserver = clickObserver.pipe(
      buffer(clickObserver.pipe(debounceTime(300))),
      map((mouseClick) => mouseClick.length),
      filter((mouseClickLenth) => mouseClickLenth === 2)
    );
    doubleClickObserver.subscribe(() => setWait(true));
  };

  const handleReset = () => {
   setTime(0)
   setWait(false)
  }

  const handleToggleStart = () => {
    if(isWait){
      setWait(false)
    }
    else {
      setWait(true)
      setTime(0)
    }
  };

  const padNum = (num) => {
    return num.toString().padStart(2,0);
}

  const formatTime = (time) =>{
    let hours = padNum(Math.trunc(time/3600));
    let minutes = padNum(Math.trunc(time%3600/60));
    let seconds = padNum(Math.trunc(time%3600%60));
    
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="App">
      <div className="time">{formatTime(time)}</div>
      <div className='btnContainer'>
        <div className="btn stop" onClick={handleToggleStart}>Start/Stop</div> 
        <div className="btn wait" onClick={handleWait}>Wait</div> 
        <div className="btn reset" onClick={handleReset}>Reset</div>
      </div> 
    </div>
  );
}

export default App;
