import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Login } from './components';
import Home from './container/Home';

const App = () => {
  const navigate = useNavigate();
  const User = useSelector(state => state.user);

  useEffect(() => {
    if (!User) navigate('/login');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='/*' element={<Home />} />
    </Routes>
  );
};

export default App;
