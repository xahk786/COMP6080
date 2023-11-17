import React from 'react'
import NavBar from './NavBar';
import { Button, Modal, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import '../global.css';

import {
  useParams,

  useNavigate
} from 'react-router-dom'

export default function EditQuestion () {
  const params = useParams();
  const navigate = useNavigate();
  const handleClickBack = () => navigate('/edit/' + params.id);

  // state variables to PUT Request
  const [thumbnail, setThumbnail] = React.useState('');
  const [name, setName] = React.useState('');
  const [questions, setQuestions] = React.useState([]); // list of all questions to send back, just need to modify the index
  const [imageType, setImageType] = React.useState('ui');
  const [quesThumbnail, setQuestionThumbnail] = React.useState('');
  const [imagePath, setImagePath] = React.useState('');
  const [imagePathValue, setImagePathValue] = React.useState('');

  // state variables for question
  const [type, setType] = React.useState('');
  const [qData, setQData] = React.useState('');
  const [points, setPoints] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [options, setOptions] = React.useState([]);

  // correct choosing stuff
  const [singleCorrect, setSingleCorrect] = React.useState([]);
  const [multipleCorrect, setMultipleCorrect] = React.useState([]);

  async function getQuizQuestions () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + params.id, {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const resp = await response.json()
    // setting variables for PUT
    setThumbnail(resp.thumbnail)
    setName(resp.name)
    setQuestions(resp.questions)
    // setting variables for question
    setType(resp.questions[params.index].type)
    setQData(resp.questions[params.index].data)
    setPoints(resp.questions[params.index].points)
    setDuration(resp.questions[params.index].duration)
    setOptions(resp.questions[params.index].options)
  }
  async function submit () {
    const editedQuestion = {
      type,
      data: qData,
      duration,
      options,
      points: parseInt(points),
      correct: (type === 'mc' ? multipleCorrect : singleCorrect),
      quesThumbnail
    }
    questions[params.index] = editedQuestion;
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
    const data = await response.json()
    console.log(data)
  }

  React.useEffect(() => {
    console.log('useEffectRan')
    getQuizQuestions()
  }, []);

  function handleCheck (option) {
    const i = multipleCorrect.indexOf(option)
    console.log(i)
    if (i === -1) {
      multipleCorrect.push(option)
    } else {
      multipleCorrect.splice(i, 1);
    }
    setMultipleCorrect(multipleCorrect)
    console.log(multipleCorrect)
  }

  function handleRadio (option) {
    setSingleCorrect([option])
  }

  function optionIsCorrect (opt) {
    console.log('CHECKING SMTHN')
    const check = multipleCorrect.includes(opt)
    console.log(check)
    return check
  }

  function addOption () {
    console.log('add option')
    if (!options.includes(newOption)) {
      options.push(newOption)
    }
    setShow(false)
  }

  const [show, setShow] = React.useState(false)
  const [newOption, setNewOption] = React.useState('')
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showRem, setShowRem] = React.useState(false)
  const handleCloseRem = () => setShowRem(false);
  const handleShowRem = () => setShowRem(true);

  function removeOption (option) {
    const i = options.indexOf(option)
    if (!(i === -1)) {
      options.splice(i, 1);
      handleCloseRem();
    }
  }

  function uploadImagePath (e) {
    let baseURL = '';
    const file = e.target.files[0];
    setImagePathValue(e.target.value)

    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      console.log('Called', reader);
      baseURL = reader.result;
      console.log(baseURL);
      setQuestionThumbnail(baseURL);
      console.log('Test quesThumbnail ' + quesThumbnail)
      // setThumbNail(baseURL);
      // console.log('Test ' + thumbnail);
    };
  }

  function imageURL (path) {
    setImagePath(path);

    setQuestionThumbnail(path);
    console.log('Test quesThumbnail ' + quesThumbnail)
  }

  return (
    <>
      <NavBar edit={<Button variant='secondary' style={{ backgroundColor: '#FF5DB2', color: '#FFDB99' }} onClick={handleClickBack}> Quiz Questions</Button>} />
      {(questions.length !== 0)
        ? (
          <div style={{ overflow: 'hidden' }}>
            {console.log(questions[params.index])}
            <Row className='d-flex flex-column justify-content-center align-items-center' style={{ height: '80vh' }}>
              <div id='questionForm_box'>
                <h3 style={{ fontSize: 27 }}> Edit Question {params.index}</h3>
                <div>
                  <Form.Check inline label="Multiple Choice" type="radio"
                    checked={type === 'mc' ? 'true' : ''}
                    onClick={() => setType('mc')}
                  />
                  <Form.Check inline label="Single Choice" type="radio"
                    checked={type === 'sc' ? 'true' : ''}
                    onClick={() => setType('sc')}
                  />
                </div>

                <div>
                  Question Data: <input style={{ width: '100%' }} value={qData} onChange={(e) => setQData(e.target.value)} /> <br />
                </div>
                <div>
                  Points: <input style={{ width: '100%' }} value={points} onChange={(e) => setPoints(e.target.value)} /> <br />
                </div>
                <div>
                  Duration: <input style={{ width: '100%' }} value={duration} onChange={(e) => setDuration(e.target.value)} /> <br />
                </div>

                <div>
                  {(type === 'mc')
                    ? (
                      <div>
                        <div style={{ width: '100%', marginTop: '10px' }}>Choose at least 2 correct answers for this question:</div>

                        {(options).map((option, ind) => (
                          <span key={ind}>
                            <Form.Check inline id='myCheck' label={option} type="checkbox"
                              onClick={() => handleCheck(option)}
                              defaultChecked={optionIsCorrect(option) ? 'true' : ''}
                            />
                          </span>
                        ))}
                      </div>
                      )
                    : (
                      <div>
                        <div style={{ width: '100%', marginTop: '10px' }}>Choose a correct answer for this question:</div>
                        {(options).map((option, ind) => (
                          <Form.Check key={ind} inline label={option} type="radio"
                            checked={singleCorrect[0] === option ? 'true' : ''}
                            onClick={() => handleRadio(option)}
                          />
                        ))}
                      </div>
                      )
                  }
                  <>
                    <div><a href='#' onClick={handleShow} >Add Option</a></div>
                    <Modal show={show} onHide={handleClose} style={{ top: '20%' }}>
                      <Modal.Body>
                        Enter a new option for this question
                        <input style={{ width: '100%' }} value={newOption} onChange={(e) => setNewOption(e.target.value)} />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={() => addOption()}>
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <div><a href='#' onClick={handleShowRem} >Remove Option</a></div>
                    <Modal show={showRem} onHide={handleCloseRem} style={{ top: '20%' }}>
                      <Modal.Body>
                        <h5>Remove option from question</h5>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {(options).map((option, key) => (
                            <Button key={key} style={{ width: '200px', marginBottom: '10px' }} onClick={() => { removeOption(option) }} >{option}</Button>
                          ))}
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseRem}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    <div>
                    <br></br>
                    <Form.Check inline label="Upload Image" type="radio"
                      checked={imageType === 'ui' ? 'true' : ''}
                      onClick={() => setImageType('ui')}
                    />
                    <Form.Check inline label="Add Image URL" type="radio"
                      checked={imageType === 'ai' ? 'true' : ''}
                      onClick={() => setImageType('ai')}
                    />
                  </div>

                    <div>
                    {(imageType === 'ui')
                      ? (
                        <>
                          <input type='file' style={{ width: '100%' }} value={imagePathValue} onChange={(e) => uploadImagePath(e)} />
                        </>
                        )
                      : (
                        <>
                          <input type='text' style={{ width: '100%' }} value={imagePath} placeholder="Paste Image URL here" onChange={(e) => imageURL(e.target.value)} />
                        </>
                        )
                    }
                  </div>
                  </>
                </div>
                <Button style={{ marginTop: '10px' }} onClick={() => submit()} variant='secondary' >Submit</Button>
              </div>
            </Row>
          </div>
          )
        : <div></div>
      }
    </>
  )
}
