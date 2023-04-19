import React from 'react'
import { Grid, AppBar, Toolbar, Typography } from '@mui/material';

import logo from './logo_rs.png'
import {
  useParams,
} from 'react-router-dom'
import { Container } from 'react-bootstrap';

function PlayerResults () {
  const [results, setResults] = React.useState([]);
  const MyLogo = () => <img style={{ position: 'fixed', height: '100px' }} src={logo}></img>;
  const params = useParams();
  React.useEffect(() => {
    getQuizResults();
    console.log('use effect ran')
  }, []);

  async function getQuizResults () {
    const response = await fetch('http://localhost:5005/play/' + params.playerid + '/results', {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer $params.playerid'
      }
    })
    const data = await response.json()
    console.log(data)
    // results.push(data)
    setResults(data)
    console.log(results)
  }

  return (
    <>
      <AppBar >
        <Toolbar style={{ height: '100px', backgroundColor: '#1F0F53' }}>
          <MyLogo />
          <Typography sx={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', fontSize: '30px' }}>
              Results
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <div >
        {(results.length === 0)
          ? (<div> </div>)
          : <div style={{ marginTop: '150px', marginLeft: '10px' }}>
            {/* {console.log(results)} */}
              <Container fluid style={{
                height: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <div style={{
                  height: '400px',
                  width: '500px',
                  border: 'solid 1px transparent ',
                  boxShadow: '0 0 30px 0 rgb(136, 133, 133)',
                  padding: '10px 15px 10px 15px',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgb(250,250,243)'
                }}>
                  {(results).map((question, index) => (
                    <Grid key={index} style={{ display: 'flex', flexDirection: 'column', padding: '5px 15px 5px 15px ' }} xs={12}>
                      <div> Question# {index}</div>
                      <div>Type: {question.correct === false ? <span>Wrong</span> : <span>Correct</span>}</div>
                    </Grid>
                  ))}
                </div>
              </Container>
          </div>
        }
      </div>
    </>
  )
}

export default PlayerResults;
