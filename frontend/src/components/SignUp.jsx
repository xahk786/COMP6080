import React from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import '../global.css';

import {
  useNavigate
} from 'react-router-dom'

function SignUp ({ onSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  async function register () {
    // console.log(email, password, name)
    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        name
      })
    })
    const data = await response.json()
    localStorage.setItem('token', data.token)
    // onSuccess(data.token)
    console.log(data)
  }

  return (
    <>
      <Container fluid >
        <Row className='d-flex flex-column justify-content-center align-items-center' style={{ height: '100vh' }}>
          <div id='signin_box'>
            <h3 style={{ fontSize: 27 }}>Register</h3>
            <div>
              Email: <input name="signup-email" style={{ width: '100%' }} value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            </div>
            <div>
              Password: <input type="password" name="signup-password" style={{ width: '100%' }} value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
            </div>
            <div>
              Name: <input name="signup-name" style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} /> <br />
            </div>
            <Button name="signup-button" style={{ marginTop: '10px' }} className='general_button' variant='secondary' onClick={register}>Register Now</Button>
            <div id='signin'> Already have an account? <a href="" onClick={() => navigate('/signin')} >Sign In</a></div>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default SignUp;
