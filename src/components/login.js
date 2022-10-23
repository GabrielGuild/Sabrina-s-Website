import React from "react";
import { useState } from 'react';
import { loginUser, registerUser } from '../utilities/apiCalls';
import { setTokenInLocalStorage } from '../utilities/utils';

const login =() => {
return(
 <div className='login'>
      <h2 className='account'>Account</h2>
      {
        (user && token) ?
          <>
            <h2>User Profile</h2>
            <p>You are logged in as {user.username}.</p>
          </> :
          <form
            className='login-form'
            onSubmit={ (event) => {
              isRegistered ? handleLogin(event) : handleRegistration(event)
          }}>
            <h3>{isRegistered ? "Login" : "Register"}</h3>
            <div>
              <div> Username </div>
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
              <div> Password </div>
              <input
                required
                type='password'
                name='password'
                placeholder='Password'
                value={password}
                onChange={(event) => { setPassword(event.target.value) }}
              />
            </div>
            {
              !isRegistered ?
              <>
                <div>
                  <div>Confirm Password</div>
                  <input
                    type='password'
                    name='password-confirmation'
                    placeholder='Password'
                    value={passwordConfirmation}
                    onChange={(event) => { setPasswordConfirmation(event.target.value) }}
                  />
                  {/* TODO: onscreen error messaging */}
                </div>
                <div>
                  <div> Full Name </div>
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
                  <div> Address </div>
                  <input
                    required
                    type='text'
                    name='address'
                    placeholder='Address'
                    value={address}
                    onChange={(event) => { setAddress(event.target.value) }}
                  />
                </div>
                <div>
                  <div> Email </div>
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
            <button type='submit'>{isRegistered ? 'Login' : 'Register'}</button>
            <br/>
            <button className='login-register-button' onClick={(event) => {
              event.preventDefault();
              isRegistered ?
              setIsRegistered(false) :
              setIsRegistered(true); 
            }}>{ isRegistered ? 'Need to register a new user?' : 'Already have an account?' }</button>
          </form>
      }
</div>
)
}
export default login;