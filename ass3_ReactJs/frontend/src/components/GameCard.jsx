import React from 'react'
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import {
  useNavigate
} from 'react-router-dom'
import StartGame from './StartGame';
import StopGame from './StopGame';
import AdvanceQuestion from './AdvanceQuestion';

export default function GameCard ({ q, del, setDel }) {
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const handleClickEdit = () => navigate('/edit/' + q.id);
  const [sId, setSid] = React.useState('')

  React.useEffect(() => {
    getQuizQuestions();
  }, []);

  async function getQuizQuestions () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + q.id, {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const questData = await response.json()
    console.log(questData)
    setData(questData)
  }

  async function deleteGame () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + q.id, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const d = await response.json()
    console.log(d)
    if (del === false) {
      setDel(true)
    } else {
      setDel(false)
    }
  }

  // async function startGame () {
  //   console.log('START!!')

  //   const response = await fetch('http://localhost:5005/admin/quiz/' + q.id + '/start', {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`
  //     }
  //   })
  //   const d = await response.json()
  //   console.log(d)
  // }

  // async function stopGame () {
  //   console.log('STOP!!!')

  //   const response = await fetch('http://localhost:5005/admin/quiz/' + q.id + '/end', {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`
  //     }
  //   })
  //   const d = await response.json()
  //   console.log(d)
  // }

  function countQuestions () {
    if (typeof data.questions !== 'undefined') {
      return (data.questions).length;
    }
  }

  function calculateDuration () {
    if (typeof data.questions !== 'undefined') {
      let dur = 0;
      for (let i = 0; i < data.questions.length; i++) {
        dur = dur + parseInt(data.questions[i].duration);
      }
      return dur;
    }
  }

  return (
    <Card style={{ width: '10rem' }} >
      <Card.Img variant="top" src={q.thumbnail} />
      <Card.Body>
        <Card.Title>{q.name}</Card.Title>
        <h6> Number of Questions: {countQuestions()}</h6>
        <h6> Duration (seconds): {calculateDuration()}</h6>
        <StartGame id={q.id} sId={sId} setSid={setSid} />
        <div style={{ marginTop: '3px' }}>
          <StopGame id={q.id} sId={sId} />
        </div>
        <div style={{ marginTop: '3px' }}>
          <AdvanceQuestion id={q.id} qCount={countQuestions()} sId={sId}/>
        </div>
        <Button style={{ marginTop: '3px' }} className='general_button' variant='secondary' onClick={handleClickEdit} >Edit</Button>
        <Button style={{ marginTop: '3px' }} className='general_button' variant='secondary' onClick={deleteGame} >Delete</Button>
      </Card.Body>
    </Card>
  );
}
