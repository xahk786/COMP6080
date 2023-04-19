/* eslint-disable */
import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap';

export default function NewQuestionCreate({ id, questData, show, setShow }) {

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [type, setType] = React.useState("mc");
  const [imageType, setImageType] = React.useState("ui");
  const [qData, setQData] = React.useState('');
  const [points, setPoints] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [quesThumbnail, setQuestionThumbnail] = React.useState('');
  const [imagePath, setImagePath] = React.useState('');
  const [imagePathValue, setImagePathValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const [singleCorrect, setSingleCorrect] = React.useState("");
  const [multipleCorrect, setMultipleCorrect] = React.useState([]);
  const [newOption, setNewOption] = React.useState("")

  const [dummy, setDummy] = React.useState(false)

  //Load to Send as PUT 
  const [name, setName] = React.useState("");
  const [thumbnail, setThumbNail] = React.useState("");
  const [questions, setQuestions] = React.useState([]);

  React.useEffect(() => {
    console.log("use effect ran")
    setName(questData.name);
    setThumbNail(questData.thumbnail);
    setQuestions(questData.questions);
  }, [show]);

  function handleRadio(opt) {
    setSingleCorrect(opt)
  }

  async function submit() {
    console.log("submit")

    const newQuestion = {
      "type": type,
      "data": qData,
      "duration": duration,
      "options": options,
      "points": parseInt(points),
      "correct": (type === "mc" ? multipleCorrect : singleCorrect),
      "quesThumbnail": quesThumbnail
    }

    console.log(name)
    console.log(thumbnail)

    questions.push(newQuestion)
    console.log(questions)

    
    const load = JSON.stringify({
      questions,
      name,
      thumbnail
    })

    const response = await fetch('http://localhost:5005/admin/quiz/' + id, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: load
    })
    const data = await response.json()
    console.log(data)
    setShow(false)
  }

  function handleCheck(option) {
    const i = multipleCorrect.indexOf(option)
    console.log(i)
    if (i == -1) {
      multipleCorrect.push(option)
    } else {
      multipleCorrect.splice(i, 1);
    }
    setMultipleCorrect(multipleCorrect)
    console.log(multipleCorrect)
  }

  function addOption() {
    if (!options.includes(newOption) && !newOption == "") {
      options.push(newOption)
    }
    { dummy === true ? setDummy(false) : setDummy(true) }
  }

  function clearOption() {
    setOptions([])
    setMultipleCorrect([])
    setSingleCorrect("")
  }

  function uploadImagePath(e){

    let baseURL = "";
    let file = e.target.files[0];

    let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        setQuestionThumbnail(baseURL);
        console.log('Test quesThumbnail ' + quesThumbnail)
      };
  }

  function imageURL(path){
    setImagePath(path);
    setQuestionThumbnail(path);
    console.log('Test quesThumbnail ' + quesThumbnail)
  }

  return (
    <>
      <Button style={{ backgroundColor: '#FF5DB2', color: '#FFDB99', border: 'none' }} onClick={handleShow}>
        Create New Question
      </Button>
      
      <Modal show={show} onHide={handleClose} style={{ top: '20%' }}>
        <Modal.Body>
          <h5>Create a new question</h5>

          <div>
            <Form.Check inline label="Multiple Choice" type="radio"
              checked={type === "mc" ? "true" : ""}
              onClick={() => setType("mc")}
            />
            <Form.Check inline label="Single Choice" type="radio"
              checked={type === "sc" ? "true" : ""}
              onClick={() => setType("sc")}
            />
          </div>

          <div>
            Question: <input style={{ width: '100%' }} value={qData} onChange={(e) => setQData(e.target.value)} /> <br />
          </div>
          <div>
            Points: <input style={{ width: '100%' }} value={points} onChange={(e) => setPoints(e.target.value)} /> <br />
          </div>
          <div>
            Duration: <input style={{ width: '100%' }} value={duration} onChange={(e) => setDuration(e.target.value)} /> <br />
          </div>

          <div>
            <a onClick={addOption} href='#'>Add Option:</a>
            <input style={{ width: '100%' }}
              value={newOption} onChange={(e) => setNewOption(e.target.value)}
              placeholder='Input option then click above to add'
            />
            <br />
          </div>

          <div>
            <br></br>
            {(type === "mc") ?
              (
                <>
                  Select at least 2 options as correct: <br></br>
                  {(options).map((option, ind) => (
                    <span >
                      <Form.Check inline id='myCheck' label={option} type="checkbox"
                        defaultChecked={multipleCorrect.includes(option) ? "true" : ""}
                        onClick={() => handleCheck(option)}
                      />
                    </span>
                  ))}
                </>
              ) :
              (
                <>
                  Select an option as correct: <br></br>
                  {(options).map((option) => (
                    <Form.Check inline label={option} type="radio"
                      checked={singleCorrect === option ? "true" : ""}
                      onClick={() => handleRadio(option)}
                    />
                  ))}
                </>
              )
            }
            <br></br>
            <a onClick={clearOption} href='#'>Clear Options:</a>
          </div>

          <div>
            <br></br>
            <Form.Check inline label="Upload Image" type="radio"
              checked={imageType === "ui" ? "true" : ""}
              onClick={() => setImageType("ui")}
            />
            <Form.Check inline label="Add Image URL" type="radio"
              checked={imageType === "ai" ? "true" : ""}
              onClick={() => setImageType("ai")}
            />
          </div>

          <div>
            {(imageType === "ui") ?
              (
                <>
                  <br></br>
                  <input type='file' style={{ width: '100%' }} value={imagePathValue} onChange={(e) => uploadImagePath(e)} />
                </>
              ) :
              (
                <>
                  <br></br>
                  <input type='text' style={{ width: '100%' }} value={imagePath} placeholder="Paste Image URL here" onChange={(e) => imageURL(e.target.value)} />
                </>
              )
            }
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={() => submit()} variant="primary">
            Create Question
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}