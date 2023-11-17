/* eslint-disable */
import React from 'react'
import { Button, Container, Form } from 'react-bootstrap';

import {
  useParams,

  useNavigate
} from 'react-router-dom'

import Countdown from './Coundown';
import { AppBar, Toolbar, Typography } from '@mui/material';
import logo from './logo_rs.png'

function GameQuestions () {
  const params = useParams();
  // data setting
  const [data, setData] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [points, setPoints] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [type, setType] = React.useState([]);
  const [quesThumbnail, setQuesThumbnail] = React.useState('nun');

  // question type toggle
  const [singleCorrect, setSingleCorrect] = React.useState('');
  const [multipleCorrect, setMultipleCorrect] = React.useState([]);

  const [poll, setPoll] = React.useState(false);
  const [advPoll, setAdvPoll] = React.useState(false);

  // timer done then set correct
  const [isOver, setIsOver] = React.useState(false)
  const [corr, setCorr] = React.useState([])

  const navigate = useNavigate();

  React.useEffect(() => {
    getQuizQuestions();
    checkAdminStart();
    checkAdminAdv();
    getCorrectAnswer();

    setIsOver(false)
    setCorr([])

    console.log(isOver)
    console.log(corr)
  }, [poll, advPoll]);

  async function getQuizQuestions () {
    console.log(params.playerid)
    const response = await fetch('http://localhost:5005/play/' + params.playerid + '/question', {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.playerid}`
      }
    })
    const data1 = await response.json()
    console.log(data1)

    if (data1.error === 'Session ID is not an active session') {
      navigate('/play/' + params.playerid + '/results')
    }

    setData(data1.question.data)
    setDuration(data1.question.duration)
    setPoints(data1.question.points)
    setOptions(data1.question.options)
    setType(data1.question.type)
    setQuesThumbnail(data1.question.quesThumbnail)
  }

  async function getCorrectAnswer () {
    const response = await fetch('http://localhost:5005/play/' + params.playerid + '/answer', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.playerid}`
      }
    })
    const resp = await response.json()
    console.log(resp)

    return resp.answerIds;
  }

  async function checkAdminStart () {
    setInterval(() => {
      fetch('http://localhost:5005/play/' + params.playerid + '/status', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${params.playerid}`
        }
      })
        .then(response => {
          response.json().then((resp) => {
            // console.log(resp)
            setPoll(resp.started)
          })
        });
    }, 1000);
  }

  async function checkAdminAdv () {
    setInterval(() => {
      fetch('http://localhost:5005/play/' + params.playerid + '/question', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${params.playerid}`
        }
      })
        .then(response => {
          response.json().then((resp) => {
            setAdvPoll(resp.question.isoTimeLastQuestionStarted)
          })
        });
    }, 1000);
  }

  async function submitAnswer (queAnswer) {
    console.log('Answer ' + queAnswer)

    let answLoad = ''
    if (type === 'mc') {
      answLoad = queAnswer
    } else {
      answLoad = [queAnswer]
    }

    const load = JSON.stringify({
      //  "answerIds": [queAnswer]
      answerIds: answLoad,
    })

    console.log(load)
    const response = await fetch('http://localhost:5005/play/' + params.playerid + '/answer', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.playerid}`
      },
      body: load
    })
    const data = await response.json()
    console.log(data)
  }

  function handleCheck (option) {
    const i = multipleCorrect.indexOf(option)
    console.log(i)
    if (i === -1) {
      multipleCorrect.push(option)
    } else {
      multipleCorrect.splice(i, 1);
    }
    setMultipleCorrect(multipleCorrect)
    console.log(multipleCorrect)
    submitAnswer(multipleCorrect)
  }

  const MyLogo = () => <img style={{ position: 'fixed', height: '100px' }} src={logo}></img>;

  return (
    <>
      {(poll !== true)
        ? <Container fluid>
          <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h3> Waiting for Admin to start ... </h3>
          </div>
        </Container>
        : <>

          <AppBar position='sticky'>
            <Toolbar style={{ height: '100px', backgroundColor: '#1F0F53' }}>
              <MyLogo />
              <Typography sx={{ flexGrow: 1, marginLeft: '150px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', flexDirection:"column" }}>
                  <Countdown props={duration} iso={advPoll} setIsOver={setIsOver} setCorr={setCorr} playerid={params.playerid}></Countdown>
                  <div style={{fontSize: '24px'}}>This question is worth {points} points</div>
                </div>
              </Typography>
              <Button style={{ backgroundColor: '#FF5DB2', color: '#FFDB99', border: 'none' }} >Exit Game</Button>
            </Toolbar>
          </AppBar>

          {/* <div>hello</div> */}
          {/* <img src={quesThumbnail} width={100} height={100}></img> */}
          <Container fluid style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(to bottom right, #C9D6FF, #E2E2E2)'
          }}>
            
            <div style={{
              height: '500px',
              width: '600px',
              border: 'solid 1px transparent ',
              boxShadow: '0 0 30px 0 rgb(136, 133, 133)',
              marginTop: '-100px',
              padding: '10px 15px 10px 15px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgb(250,250,243)'
            }}>
              
              <div style={{ textAlign: 'center', fontSize: '24px' }}>{data}</div>    
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                {quesThumbnail.includes('www.youtube.com/watch')
                  ? <a href={quesThumbnail} rel="noopener noreferrer" target="_blank"> {quesThumbnail} </a>
                  : <img src={quesThumbnail} width={150} height={150}></img>
                }
              </div>
              <br></br>
              <div>
                {(type === 'mc')
                  ? (
                    <>
                      Select 2 or more options as correct: <br></br>
                      {(options).map((option, ind) => (
                        <span >
                          <Form.Check inline id='myCheck' label={option} type="checkbox" style={{ fontSize: '20px' }}
                            defaultChecked={multipleCorrect.includes(option) ? 'true' : ''}
                            onClick={() => handleCheck(option)}
                            disabled={isOver === false ? '' : 'true'}

                          />
                        </span>
                      ))}
                    </>
                    )
                  : (
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingLeft: '30px' }}>
                      {(options).map((option, ind) => (
                        <Form.Check inline label={option} type="radio" style={{ fontSize: '20px' }}
                          value={option}
                          checked={singleCorrect[0] === option ? 'true' : ''}

                          disabled={isOver === false ? '' : 'true'}

                          onChange={(e) => {
                            setSingleCorrect([e.target.value])
                            submitAnswer(e.target.value)
                          }}
                        />
                      ))}
                    </div>
                    )
                }
              </div>

              {isOver !== false
                ? <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <h4>Answer</h4>
                  {'length' in corr
                    ? <>
                  {(corr.length !== 0)
                    ? (corr).map((answ, ind) => (
                      <div>{answ}</div>
                      ))
                    : <div></div>
                  }
                  </>
                    : 'loading answers'}
                </div>
                : <div></div>}
            </div>
          </Container>
        </>
        // <div>
        //   <div>Points: {points}</div>
        //   <div>Duration: {duration} </div>
        //   <Countdown props={duration}></Countdown>
        //   <br></br>
        //   <div>Question: {data}</div>
        //   <img style={{ height: '200px' }} src={quesThumbnail} />
        //   <br></br>
        //   <br></br>
        //   <span>
        //     <span>Options: </span>
        //     {(type === "mc") ?
        //       (
        //         <>
        //           Select at least 2 options as correct: <br></br>
        //           {(options).map((option, ind) => (
        //             <span >
        //               <Form.Check inline id='myCheck' label={option} type="checkbox"
        //                 defaultChecked={multipleCorrect.includes(option) ? "true" : ""}
        //                 onClick={() => handleCheck(option)}
        //               />
        //             </span>
        //           ))}
        //         </>
        //       ) :
        //       (
        //         <>
        //           Select an option as correct: <br></br>
        //           {(options).map((option) => (
        //             <Form.Check inline label={option} type="radio"
        //               checked={singleCorrect === option ? "true" : ""}
        //               onClick={() => handleRadio(option)}
        //             />
        //           ))}
        //         </>
        //       )
        //     }
        //   </span>
        // </div>
      }
    </>
  )
}

export default GameQuestions;
