import React from 'react';
import { Container } from 'react-bootstrap';
import GameCard from './GameCard';
import NewGame from './NewGameCreate';

import {
  useNavigate
} from 'react-router-dom'
import NavBar from './NavBar';
import { Grid } from '@mui/material';

function Dashboard () {
  const [quizData, setQuizData] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [del, setDel] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    getData();
    console.log('use effect ran')
  }, [show, del]);

  async function getData () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()
    // console.log(data)
    setQuizData(data.quizzes)
  }

  return (
    <> {(localStorage.getItem('token') !== null)

      ? (
        <>
          <NavBar newGame={<NewGame show={show} setShow={setShow} />}></NavBar>
          <Container fluid>
            {console.log(quizData)}
            <Grid container rowGap={6} style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} >
              {quizData.map((quiz, key) => (
                <Grid key={key} style={{ display: 'flex', justifyContent: 'center' }} xs={12} sm={6} md={4}>
                  <GameCard q={quiz} del={del} setDel={setDel}></GameCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
        )
      : <h1 style={{ textAlign: 'center' }}>Please <a href='' onClick={() => navigate('/signin')}>sign in</a> to view your dashboard</h1>}
    </>
  )
}

export default Dashboard;
