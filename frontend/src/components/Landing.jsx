import React from 'react'
import logo from './logo_rs.png'
import { Container, Row, Button } from 'react-bootstrap'
import {
  useNavigate
} from 'react-router-dom'

export default function Landing () {
  const navigate = useNavigate();
  const MyLogo = () => <img style={{ borderRadius: '30px', position: 'fixed', marginTop: '-200px' }} src={logo}></img>;

  const [name, setName] = React.useState('');
  const [sessionId, setSessionId] = React.useState(localStorage.getItem('SessionId'));

  React.useEffect(() => {
    console.log('use effect ran')

    const URL = window.location.href;
    const id = URL.split('SessionId=')
    console.log(id[1])
    setSessionId(id[1])
  }, []);

  async function playNow () {
    console.log('sessionId ' + sessionId)
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
    navigate('/play/' + data.playerId + '/question')
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <MyLogo />
        <Container fluid style={{ marginTop: '300px' }}>
          <Row className='d-flex flex-column justify-content-center align-items-center'>
            <div id='sessionLaunch_box'>
              <input placeholder='Session Id' style={{ width: '100%', textAlign: 'center' }} value={sessionId} onChange={(e) => setSessionId(e.target.value)} /> <br />
              <input placeholder='Player Name' style={{ width: '100%', textAlign: 'center' }} value={name} onChange={(e) => setName(e.target.value)} /> <br />
              <Button style={{ marginTop: '10px' }} onClick={playNow}>Play Now</Button>
              <div id='signUp'> Want to create your own BigBrain? <a name="admin-link" href="" onClick={() => navigate('/signin')} >Sign in as admin</a></div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  )
}
