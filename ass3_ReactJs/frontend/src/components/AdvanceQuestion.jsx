/* eslint-disable */
import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import {
  useNavigate
} from 'react-router-dom'

export default function AdvanceQuestion({ id, qCount, sId }) {
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [err, setErr] = React.useState('')
  const [currStage, setCurrStage] = React.useState('')

  const navigate = useNavigate();

  async function advanceGame() {
    console.log('Advance!!')
    const response = await fetch('http://localhost:5005/admin/quiz/' + id + '/advance', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const d = await response.json()
    console.log(d)

    if (typeof d.error === 'undefined') {
      setErr(false)
      console.log(d.stage)
      setCurrStage(d.stage)
      handleShow();
    } else if (d.error === 'Quiz has no active session') {
      setErr(true)
      handleShow();
    }
  }

  function advanceFinish(){
    navigate('/results/' + sId);
    handleClose()
  }

  return (
    <>
      <Button style={{ width: '100%' }} className='navButton' variant="secondary" onClick={advanceGame}>
        Advance
      </Button>

      <Modal show={show} onHide={handleClose} style={{ top: '20%' }}>
        <Modal.Body>
          {!err
            ?
            <>
              {parseInt(currStage) === parseInt(qCount)
                ? <div>Quiz has advanced to its end. Would you like to go to results?</div>
                : <div>Stage is {currStage}</div>}
            </>
            : <div>Game has no active session. Cannot advance</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {parseInt(currStage) === parseInt(qCount) ? <Button onClick={advanceFinish}>Yes</Button> : <div></div>}
        </Modal.Footer>
      </Modal>
    </>
  )
}
