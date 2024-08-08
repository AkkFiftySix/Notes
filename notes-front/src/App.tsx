import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from "./pages/Login/Login"
import Registration from './pages/Registration/Registration';
import Main from './pages/Main/Main';
import { Toaster } from 'react-hot-toast';
import { useUnit } from 'effector-react';
import { $isLogin } from './common/sessionStorage';

function App() {
  const isLoggedIn = useUnit($isLogin);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to='/' /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to='/' /> : <Registration />} />
          <Route path="/" element={isLoggedIn ? <Main isTrash={false}/> : <Navigate to='/login' />} />
          <Route path="/trash" element={isLoggedIn ? <Main isTrash={true}/> : <Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


