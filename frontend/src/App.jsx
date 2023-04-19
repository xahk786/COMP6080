/* eslint-disable */

import React from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import EditQuestion from './components/EditQuestion';
import Edit from './components/Edit';
import Landing from './components/Landing';
import Play from './components/Play';
import GameQuestions from './components/GameQuestions';
import PlayerResults from './components/PlayerResults';

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import GameResults from './components/GameResults';


function App () {

  return (
    <>
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/editQuestion/:id/:index" element={<EditQuestion/>} />
        <Route path="/play/join" element={<Play/>} />
        <Route path="/play/:playerid/question" element={<GameQuestions/>} />
        <Route path="/play/:playerid/results" element={<PlayerResults/>} />
        <Route path="/results/:sessionid" element={<GameResults/>} />
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
