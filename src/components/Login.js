import React from 'react';
import { useState } from 'react';
import { loginUser, registerUser } from '../utilities/apiCalls.js';
import { setTokenInLocalStorage } from '../utilities/utils';


const Login =({ token, setToken, user, setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isRegistered, setIsRegistered] = useState(true);
    const [address, setAddress] = useState('');
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        event.stopPropagation()
        const login = await loginUser(username, password);
        if (login.error) {
          alert(`Error: ${login.message} If you do not have an account, please register.`);
        } else if (login.user && login.token) {
          setUserData(login.user, login.token);
        } else {
          alert('There was an error during login.');
        }
      }
    
      const handleRegistration = async (event) => {
        event.preventDefault();
        if (password !== passwordConfirmation) {
          alert("The passwords don't match!")
        } else {
          const registration = await registerUser(username, password, address, fullname, email);
          if (registration.error) {
            alert(`Error: ${registration.message}`);
          } else if (registration.user && registration.token) {
            setUserData(registration.user, registration.token);
          } else {
            alert('There was an error during registration.');
          }
        }
      }
    
      const setUserData = (returnedUser, returnedToken) => {
        setUser(returnedUser);
        setToken(returnedToken);
        setTokenInLocalStorage(returnedToken);
        resetForm();
      }
    
      const resetForm = () => {
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
        setAddress('');
        setFullName('');
        setEmail('');
        setIsRegistered(true);
      }

return(
<div className="account-container">
    <h2 className='page-titles'>{(user && token) ? 'User Profile':null}</h2>
      {
        (user && token) ?
          <div className='cart-form'>
            <p style={{marginTop: '1em'}}>Welcome back!</p>
            <p>Username: {user.username}</p>
            <p>Full Name: {user.fullname}</p>
            <p>Email: {user.email}</p>
          </div> :
          <form
            className='large-forms'
            onSubmit={(event) => {
              isRegistered ? handleLogin(event) : handleRegistration(event)
            }}>
            <h3>{isRegistered ? "Login" : "Register"}</h3>
            <div>
              <input
                required
                type='text'
                name='username'
                placeholder='Username'
                value={username}
                onChange={(event) => { setUsername(event.target.value) }}
              />
            </div>
            <div>
              <input
                required
                type='password'
                name='password'
                placeholder='Password'
                value={password}
                onChange={(event) => { setPassword(event.target.value) }}
              />
              {
                (password && password.length < 8) ?
                <p style={{fontSize: '10pt', color: 'red'}}>Password must be at least 8 characters.</p> :
                null
              }
            </div>
            {
              !isRegistered ?
                <>
                  <div>
                    <input
                      type='password'
                      name='password-confirmation'
                      placeholder='Confirm Password'
                      value={passwordConfirmation}
                      onChange={(event) => { setPasswordConfirmation(event.target.value) }}
                    />
                  </div>
                  {
                    (password && passwordConfirmation && (password != passwordConfirmation)) ?
                    <p style={{fontSize: '10pt', color: 'red'}}>Passwords don't match!</p> :
                    null
                  }
                  <div>
                    <input
                      required
                      type='text'
                      name='fullname'
                      placeholder='Full Name'
                      value={fullname}
                      onChange={(event) => { setFullName(event.target.value) }}
                    />
                  </div>
                  <div>
                    <input
                      required
                      type='text'
                      name='email'
                      placeholder='Email'
                      value={email}
                      onChange={(event) => { setEmail(event.target.value) }}
                    />
                  </div>
                </> :
                null
            }
            <button className='login-register-button' type='submit'>{isRegistered ? 'Login' : 'Register'}</button>
            <br />
            <button className='login-register-button' onClick={(event) => {
              event.preventDefault();
              isRegistered ?
                setIsRegistered(false) :
                setIsRegistered(true);
            }}>{isRegistered ? 'Need to register a new user?' : 'Already have an account?'}</button>
          </form>
      }
</div>
    ) 
}

export default Login;