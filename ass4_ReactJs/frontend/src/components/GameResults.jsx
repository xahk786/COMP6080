/* eslint-disable */
import React from 'react'
import {
  useParams,
} from 'react-router-dom'
import NavBar from './NavBar';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Line, Bar, ComposedChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function GameResults () {
  const params = useParams();
  const [results, setResults] = React.useState([]);
  const [questionData, setQuestionData] = React.useState([]);
  const [quizName, setQuizName] = React.useState([]);

  React.useEffect(() => {
    collectDataFixUp();
    console.log('use effect ran')
  }, []);

  async function collectDataFixUp () {
    const responseQ = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const dataQ = await responseQ.json()
    const quizzes = dataQ.quizzes

    let quizId = 0;
    for (var i = 0; i < quizzes.length; i++) {
      if (quizzes[i].oldSessions.includes(parseInt(params.sessionid))) {
        quizId = quizzes[i].id
      }
    }

    const responseQues = await fetch('http://localhost:5005/admin/quiz/' + quizId, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const dataQuest = await responseQues.json()
    setQuizName(dataQuest.name)
    const myQuestions = [...dataQuest.questions]

    const responseRes = await fetch('http://localhost:5005/admin/session/' + params.sessionid + '/results', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const dataRes = await responseRes.json()

    const myRes = [...dataRes.results]

    for (var i = 0; i < myRes.length; i++) { // eslint-disable-line
      let total = 0
      for (let y = 0; y < myRes[i].answers.length; y++) {
        const points = myQuestions[y].points
        myRes[i].answers[y].points = points
        if (myRes[i].answers[y].correct === true) {
          total = total + points;
        }
      }
      myRes[i].total = total
    }

    getQuestionAvgResp(myRes, myQuestions)
    getQuestionPercentageCorrect(myRes, myQuestions)
    sortArray(myRes)

    console.log(myRes)
    console.log(myQuestions)
    setResults(myRes)
    setQuestionData(myQuestions)
  }

  function sortArray (array) {
    array.sort((a, b) => {
      if (a.total > b.total) return -1;
      if (a.total < b.total) return 1;
      return 0;
    });
  }

  function getQuestionPercentageCorrect (results, questions) {
    for (let i = 0; i < questions.length; i++) {
      const currQ = questions[i]
      let totalCorr = 0
      for (let y = 0; y < results.length; y++) {
        const currPlayer = results[y]
        if (currPlayer.answers[i].correct === true) {
          totalCorr = totalCorr + 1
        }
      }
      const percentage = totalCorr / (results.length)
      currQ.percentage = percentage
    }
  }

  function getQuestionAvgResp (results, questions) {
    for (let i = 0; i < questions.length; i++) {
      const currQ = questions[i]
      let responseTotal = 0
      for (let y = 0; y < results.length; y++) {
        const currPlayer = results[y]
        responseTotal = responseTotal + timeDiff(currPlayer.answers[i].questionStartedAt, currPlayer.answers[i].answeredAt)
      }
      const averageResp = responseTotal / (results.length)
      currQ.averageResp = averageResp
    }
  }

  function timeDiff (iso1, iso2) {
    const date1 = new Date(iso1);
    const date2 = new Date(iso2);
    return (date2.getTime() - date1.getTime()) / 1000;
  }

  return (
    <> {(localStorage.getItem('token') !== null)
      ? (
        <div>
          <NavBar ></NavBar>

          {(results.length !== 0)
            ? <>
              <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Results for {quizName} : {params.sessionid} </h1>
              <Table style={{}} responsive striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th style={{ width: '33vw' }}>Rank</th>
                    <th style={{ width: '33vw' }}>Name</th>
                    <th style={{ width: '33vw' }}>Total Points Scored</th>
                  </tr>
                </thead>

                <tbody>
                   {(results).map((i, key) => (   /* eslint-disable-line */
                    <tr>
                      <th>{key + 1} </th>
                      <th>{i.name}</th>
                      <th>{i.total}</th>
                    </tr>
                   ))}
                </tbody>
              </Table>

              <Container>
                <Row style={{ marginTop: '50px' }}>
                  <h3 style={{ textAlign: 'center' }}>Percentage of players that scored a question correct </h3>
                  <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} xs={12}>
                    <ComposedChart width={600}
                      height={500}
                      data={questionData}
                    >
                      <XAxis dataKey="data" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="percentage" stroke="#ff7300" yAxisId={0} />
                      <Bar dataKey="percentage" fill="#8884d8" />
                    </ComposedChart>
                  </Col>
                </Row>

                <Row style={{ marginTop: '50px' }}>
                  <h3 style={{ textAlign: 'center' }}>Average question/answer reponse time (seconds)</h3>
                  <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} xs={12}>
                    <ComposedChart width={600}
                      height={500}
                      data={questionData}
                    >
                      <XAxis dataKey="data" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="averageResp" stroke="#ff7300" yAxisId={0} />
                    </ComposedChart>
                  </Col>
                </Row>
              </Container>
            </>
            : <div></div>
          }

        </div>
        )
      : <div></div>
    }
    </>

  )
}
