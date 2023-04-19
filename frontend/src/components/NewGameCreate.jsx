import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function NewGame ({ show, setShow }) {
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [gameName, setGameName] = React.useState('');

  const submit = () => {
    createNewGame();
  }

  async function createNewGame () {
    const response = await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name: gameName,
      })
    });
    const data = await response.json()
    console.log(data)
    setShow(false)
  }

  return (
    <>
      <Button style={{ backgroundColor: '#FF5DB2', color: '#FFDB99', border: 'none' }} onClick={handleShow}>
        Create a new quiz
      </Button>

      <Modal show={show} onHide={handleClose} style={{ top: '20%' }}>
        <Modal.Body>
          Enter a name for the new quiz:
          <input style={{ width: '100%' }} value={gameName} onChange={(e) => setGameName(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
