import React from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import '../global.css';

import {
  useNavigate
} from 'react-router-dom'

function Play () {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [sessionId, setSessionId] = React.useState('');

  async function playNow () {
    const response = await fetch('http://localhost:5005/play/join/' + sessionId, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    })
    const data = await response.json()
    console.log(data)
    localStorage.setItem('playerId', data.playerId)

    navigate('/play/' + data.playerId + '/question')
  }

  return (
    <>
      <Container fluid >
        <Row className='d-flex flex-column justify-content-center align-items-center' style={{ height: '100vh' }}>
          <div id='signin_box'>
            <h3 style={{ fontSize: 27 }}> Welcome to BigBrain</h3>
            <div>
              Session ID: <input style={{ width: '100%' }} value={sessionId} onChange={(e) => setSessionId(e.target.value)} /> <br />
            </div>
            <div>
              Name: <input style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} /> <br />
            </div>
            <Button style={{ marginTop: '10px' }} className='general_button' variant='secondary' onClick={playNow}>Play Now</Button>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default Play;
