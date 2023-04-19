import React from 'react'
import NavBar from './NavBar';
import { Grid } from '@mui/material';
import { Button } from 'react-bootstrap';

import {
  useParams,

  useNavigate
} from 'react-router-dom'

import NewQuestionCreate from './NewQuestionCreate';

export default function Edit () {
  const params = useParams();
  const [imagePath, uploadImagePath] = React.useState('');
  const [thumbnail, setQuizThumbnail] = React.useState('');
  const [data, setData] = React.useState([]);
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [del, setDel] = React.useState(false);
  const [cover, setCover] = React.useState(false);

  function handleClickEdit (index) {
    navigate('/editQuestion/' + params.id + '/' + index);
  }

  async function handleClickDel (question, index) {
    console.log(question)
    console.log(index)
    console.log(data)

    const questions = data.questions;
    console.log(questions)
    questions.splice(index, 1);
    console.log(questions)

    const thumbnail = data.thumbnail;
    const name = data.name;

    const load = JSON.stringify({
      questions,
      name,
      thumbnail
    })

    const response = await fetch('http://localhost:5005/admin/quiz/' + params.id, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: load
    })
    const dt = await response.json()
    console.log(dt)

    if (del === true) {
      setDel(false)
    } else {
      setDel(true)
    }
  }

  React.useEffect(() => {
    getQuizQuestions();
    console.log('use effect ran')
  }, [show, del]);

  async function getQuizQuestions () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + params.id, {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const questData = await response.json()
    console.log(questData)
    setData(questData)
    setCover(questData.thumbnail);
  }

  function uploadQuizImagePath (e) {
    let baseURL = '';
    const file = e.target.files[0];
    uploadImagePath(e.target.value)

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      console.log('Called', reader);
      baseURL = reader.result;
      console.log(baseURL);
      setQuizThumbnail(baseURL);
      console.log('Test Thumbnail ' + thumbnail)
    };
  }

  async function uploadQuizImage () {
    console.log('Test Upload Thumbnail ' + thumbnail)
    setCover(thumbnail);
    const load = JSON.stringify({
      thumbnail
    })

    const response = await fetch('http://localhost:5005/admin/quiz/' + params.id, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: load
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <>
      <NavBar addQuestion={<NewQuestionCreate id={params.id} questData={data} show={show} setShow={setShow} />} />
      <img style={{ objectFit: 'cover', width: '100%', height: '250px' }} src={cover}></img>
      <br></br><br></br>
      Upload Image
      <input type='file' style={{ width: '100%' }} value={imagePath} onChange={(e) => uploadQuizImagePath(e)} />
      <br></br>
      <Button onClick={() => uploadQuizImage()} variant="primary">
        Upload Image
      </Button>

      {(data.length !== 0)
        ? (
          <Grid container rowGap={6} style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} >
            {(data.questions).map((question, index) => (
              <Grid key={index} style={{ display: 'flex', flexDirection: 'column', padding: '5px 15px 5px 15px ' }} xs={12}>
                <div> Question# {index}</div>
                {question.quesThumbnail.includes('www.youtube.com/watch')
                  ? <><a href={question.quesThumbnail} rel="noopener noreferrer" target="_blank"> {question.quesThumbnail} </a></>
                  : <><img src={question.quesThumbnail} width={150} height={150}></img></>
                }
                <div>Type: {question.type === 'sc' ? <span>Single Choice</span> : <span> Multiple Choice </span>}</div>
                <div>Question: {question.data}</div>
                <div>Points: {question.points}</div>
                <div>Duration: {question.duration} </div>
                <span>
                  <span>Options: </span>
                  {(question.options).map((option, key) => (
                    <span key={key}>{option} </span>
                  ))}
                </span>

                {question.type === 'mc'
                  ? <span>
                    <span>Correct Answers: </span>
                    {(question.correct).map((answer, key) => (
                      <span key={key}>{answer} </span>
                    ))}
                  </span>
                  : <div>Correct Answer: {question.correct}</div>
                }

                <Button style={{ marginTop: '3px' }} variant='secondary'
                  onClick={() => handleClickEdit(index)}>
                  Edit Question
                </Button>

                <Button style={{ marginTop: '3px' }} variant='secondary'
                  onClick={() => handleClickDel(question, index)}>
                  Delete Question
                </Button>
              </Grid>
            ))}

          </Grid>)
        : <div></div>
      }
    </>
  )
}
