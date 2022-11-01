import React from "react";
import { useState, useEffect } from "react";
import { fetchAllUsers, patchAdminStatus } from "../utilities/apiCalls";
import {
  filterForOtherAdmins,
  filterForCurrentAdmin,
  filterForNonAdmins,
  filterOutOldVersion,
} from "../utilities/utils";

const Admin = ({ user, token }) => {
  const [allUsersData, setAllUsersData] = useState([])

  useEffect(() => {
    if (user && user.isAdmin) {
      (async () => {
        const users = await fetchAllUsers()
        setAllUsersData([
          ...filterForCurrentAdmin(users, user.id),
          ...filterForOtherAdmins(users, user.id),
          ...filterForNonAdmins(users)
        ])
      })()
    }
  }, [])

  const handleAdminStatusEdit = async (event, userObj) => {
    event.preventDefault();
    const isAdmin = !userObj.isAdmin;
    const userData = await patchAdminStatus(token, { userId: userObj.id, isAdmin });

    if (userData.message) {
      alert(`Error: ${userData.messsage}`)
    } if (userData.id) {
      setAllUsersData([
        ...filterForCurrentAdmin(allUsersData, user.id),
        ...filterForOtherAdmins(filterOutOldVersion(allUsersData, userData), user.id),
        userData,
        ...filterForNonAdmins(filterOutOldVersion(allUsersData, userData))
      ])
    } else {
      alert("There was an error updating the user's admin status");
    }
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="admin-body">
        <h2 className="page-titles">You are not logged in as an Admin.</h2>
      </div>
    )
  } else return (
    <div className="admin-body">

      <h2 className="page-titles"> Review Users </h2>
      <div id="all-users-container">
        {
          (allUsersData && allUsersData.length > 0) ?
            allUsersData.map((userData => {
              return (
                <div key={userData.id} className='single-user'>
                  <h2>{userData.username}</h2>
                  <p>Name: {userData.fullname}</p>
                  <p>Address: {userData.address}</p>
                  <p>Email: {userData.email}</p>
                  <p>Admin Status: {userData.isAdmin ? 'Yes' : 'No'}</p>
                  {
                    (userData.id !== user.id) ?
                      <button onClick={(event) => {
                        handleAdminStatusEdit(event, userData)
                      }}>{userData.isAdmin ? 'Remove Admin' : 'Make Admin'}</button> :
                      null
                  }
                </div>
              )
            })) :
            <div>Nothing to show</div>
        }
      </div>
    </div>
  )
}

export default Admin