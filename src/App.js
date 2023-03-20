import './App.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from './components/Home/Home';
import Register from './components/Registration/Register';
import { useEffect, useState } from 'react';
import { auth, getUserDB } from './firebase';
import Account from './components/Account/Account';

function App() {
  const [isAuthenticate, setISAuthenticate] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const fetchUserDetails = async (uid) => {
    const userDetails = await getUserDB(uid);
    setUserDetails(userDetails)
  }
  useEffect(() => { //useEffect m async mt banoo acchi practice nhi hai
    const listner = auth.onAuthStateChanged(user => {
      if (!user) {
        setISAuthenticate(false);
        return
      }
      setISAuthenticate(true);
      fetchUserDetails(user.uid);;
    })
    return () => listner();
  }, [])
  return (
    <div className="App">
      <Router>
        <Routes>
          {
            !isAuthenticate && (
              <>
                <Route path="/login" element={<Register />} />
                <Route path="/singup" element={<Register singup />} />
              </>
            )}

          <Route path="/account" element={<Account userDe={userDetails} auth={isAuthenticate} />} />
          <Route path="/" element={<Home auth={isAuthenticate} />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
