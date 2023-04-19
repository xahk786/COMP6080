import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import {
  useNavigate
} from 'react-router-dom'

export default function StopGame ({ id, sId }) {
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const [err, setErr] = React.useState(false)

  async function stopGame () {
    console.log('STOP!!!')

    const response = await fetch('http://localhost:5005/admin/quiz/' + id + '/end', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const d = await response.json()
    console.log(d)

    handleShow();
    if (typeof d.error === 'undefined') {
      setErr(false)
    } else {
      setErr(true)
      console.log('there was an error')
    }
  }

  function goToResults () {
    console.log('navigate to results page')
    navigate('/results/' + sId);
    handleClose()
  }

  return (
    <>
      <Button style={{ width: '100%' }} className='navButton' variant="secondary" onClick={stopGame}>
        Stop
      </Button>

      <Modal show={show} onHide={handleClose} style={{ top: '20%' }}>
        <Modal.Body>
          {!err
            ? <div>Game has stopped. Would you like to view the results?</div>
            : <div>There is no active session for this game</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          {!err
            ? <Button variant="primary" onClick={goToResults }>
            Yes
          </Button>
            : <div></div>}
        </Modal.Footer>
      </Modal>
    </>
  )
}
