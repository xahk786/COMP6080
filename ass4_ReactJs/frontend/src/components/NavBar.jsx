import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material'
import { Button } from 'react-bootstrap';
import '../global.css';
import logo from './logo_rs.png'

import {
  useNavigate
} from 'react-router-dom'

export default function NavBar ({ newGame, edit, addQuestion, dashboard }) {
  const navigate = useNavigate();
  const handleClickDash = () => navigate('/dashboard');

  async function logout () {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json()
    console.log(data)

    if (!(typeof data.error !== 'undefined')) {
      localStorage.removeItem('token')
      navigate('/signin')
    }
  }

  const MyLogo = () => <img style={{ position: 'fixed', height: '100px' }} src={logo}></img>;

  return (
    <AppBar position='sticky'>
      <Toolbar style={{ height: '100px', backgroundColor: '#1F0F53' }}>
        <MyLogo />

        <Typography sx={{ flexGrow: 1, marginLeft: '150px' }}>
          <Button style={{ backgroundColor: '#FF5DB2', color: '#FFDB99', border: 'none', marginRight: '10px' }} onClick={handleClickDash} >Dashboard</Button>
          {newGame}
          {edit}
          {addQuestion}
        </Typography>
        <Button name="logout-button" style={{ backgroundColor: '#FF5DB2', color: '#FFDB99', border: 'none' }} onClick={logout} >Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
