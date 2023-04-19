import React from 'react'
import { Button, Modal } from 'react-bootstrap';

export default function StartGame ({ id, sId, setSid }) {
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [err, setErr] = React.useState('')

  async function startGame () {
    console.log('START!!')
    const response = await fetch('http://localhost:5005/admin/quiz/' + id + '/start', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const d = await response.json()
    // console.log(d)

    if (typeof d.error === 'undefined') {
      setErr(false)
      handleShow();
    } else if (d.error === 'Quiz already has active session') {
      setErr(true)
      handleShow();
    }

    const respActive = await fetch('http://localhost:5005/admin/quiz/' + id, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const respA = await respActive.json()
    console.log(respA)

    setSid(respA.active)
  }

  async function copyLink () {
    const URL = window.location.href
    const URL2 = URL.split(window.location.port)

    // const response = await fetch('http://localhost:5005/admin/quiz/' + id, {
    //   method: 'GET',
    //   headers: {
    //     'Content-type': 'application/json',
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    //   }
    // })
    // const d = await response.json()
    // console.log(d)
    // console.log('User ' + d.active)

    const finalURL = URL2[0] + window.location.port + '/?SessionId=' + sId
    console.log('URL ' + finalURL)

    navigator.clipboard.writeText(finalURL)
    handleClose();
  }

  return (
    <>
      <Button style={{ width: '100%' }} className='navButton' variant="secondary" onClick={startGame}>
        Start
      </Button>

      <Modal show={show} onHide={handleClose} style={{ top: '20%' }}>
        <Modal.Body>
          {err ? <div>Game already in progress</div> : <div>Game has started. Please copy the link to your game session. </div> }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={copyLink}>
            Copy link
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
