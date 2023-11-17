/* eslint-disable */

import React, { useState, useEffect } from 'react';

const Countdown = ({ props, iso, setIsOver, setCorr, playerid }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  function targetTime() {
    const target = new Date(iso);
    return target.setTime(target.getTime() + props * 1000);
  }

  async function getCorrectAnswer() {
    const response = await fetch('http://localhost:5005/play/' + playerid + '/answer', {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${playerid}`
      }
    })
    const resp = await response.json()
    console.log(resp)
    setIsOver(true)
    setCorr(resp.answerIds)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toISOString();
      const timeDiffInSeconds = Math.round((new Date(targetTime()) - new Date(currentTime)) / 1000);
      
      console.log(timeDiffInSeconds)
      
      if (timeDiffInSeconds <= 0) {
        clearInterval(interval);
        setRemainingTime(0);
        
        getCorrectAnswer();
      } else {
        setRemainingTime(timeDiffInSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);

  }, [targetTime()]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {remainingTime === null ? (
        <div> </div>
      ) : remainingTime === 0 ? (
        <h3>Time's up</h3>
      ) : (
        <h3>Time left: {formatTime(remainingTime)}</h3>
      )}
    </div>
  );
};

export default Countdown;
