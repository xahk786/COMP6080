import React from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import '../global.css';

import {
  useNavigate
} from 'react-router-dom'

function SignIn () {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [errMsg, setErrMsg] = React.useState(<div></div>)

  async function login () {
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    const data = await response.json()
    console.log(data)

    if (typeof data.token !== 'undefined') {
      console.log(data.token)
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } else {
      // alert("Incorrect username or password")
      setErrMsg(<div id="errMsg" >Your email or password is incorrect. Please re-enter your details.</div>)
    }
  }

  React.useEffect(() => {
    localStorage.removeItem('token')
  }, []);

  return (
    <>
      <Container fluid >
        <Row className='d-flex flex-column justify-content-center align-items-center' style={{ height: '100vh' }}>
          <div id='signin_box'>
            <h3 style={{ fontSize: 27 }}> Sign In</h3>
            <div>
              Email: <input name="login-email" style={{ width: '100%' }} value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            </div>
            <div>
              Password: <input type="password" name="login-password" style={{ width: '100%' }} value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
            </div>
            <Button name="login-button" style={{ marginTop: '10px' }} className='general_button' variant='secondary' onClick={login}>Log In</Button>
            {errMsg}
            <div id='signUp'> Dont have an account? <a href="" onClick={() => navigate('/signup')} >Sign Up</a></div>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default SignIn;
