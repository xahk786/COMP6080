import React from 'react'
import { Button } from 'react-bootstrap';

export default function QuestionData ({ qId, del, setDel }) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getQuizQuestions(qId);
  }, []);

  async function getQuizQuestions (id) {
    const response = await fetch('http://localhost:5005/admin/quiz/' + id, {
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
    const response = await fetch('http://localhost:5005/admin/quiz/' + qId, {
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
    // <div>There are {data.questions.length} questions in this quiz</div>
    <>
      <h6> Number of Questions: {countQuestions()}</h6>
      <h6> Duration (seconds): {calculateDuration()}</h6>
      <Button style={{ }} className='general_button' variant='secondary' onClick={deleteGame} >Delete Quiz</Button>

    </>
  )
}
