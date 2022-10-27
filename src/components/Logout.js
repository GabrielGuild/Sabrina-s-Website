import React from 'react';
import { removeTokenFromLocalStorage } from '../utilities/utils';

const Logout = ({ isLoggingOut, setIsLoggingOut, setUser, setToken }) => {
  const logoutUser = (event) => {
    event.preventDefault();
    setUser(false);
    setToken('');
    removeTokenFromLocalStorage();
    setIsLoggingOut(false);
  }

  const cancelLogout = (event) => {
    event.preventDefault();
    setIsLoggingOut(false);
  }

  return (
    isLoggingOut ?
    <div className='logout-popup' style={{zIndex: '500'}}>
      <h3>Are you sure?</h3>
      <button onClick={ logoutUser }>Logout</button>
      <button onClick= { cancelLogout }>Cancel</button>
    </div> :
    null
  )
}

export default Logout;