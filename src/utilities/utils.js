// HANDLING LOCAL STORAGE:

export const setTokenInLocalStorage = (token) => {
    localStorage.setItem('grace-shopper-jwt', JSON.stringify(token));
    console.log('Token set.')
  }
  
  export const removeTokenFromLocalStorage = () => {
    localStorage.removeItem('grace-shopper-jwt');
    console.log('Token removed.')
  }
  
  export const checkLocalStorage = () => {
    const localToken = localStorage.getItem('grace-shopper-jwt');
    if (localToken && localToken.length > 0) {
      console.log('Token found in storage.')
      return localToken;
    } else {
      console.log('No token found in storage.')
      return false;
    }
  }
  
  // FILTERING USERS FOR ADMIN:
  
  export const filterForCurrentAdmin = (usersData, userId) => {
    return usersData.filter(userData => {
      return userData.id === userId
    })
  }
  
  export const filterForOtherAdmins = (usersData, userId) => {
    return usersData.filter(userData => {
      return userData.isAdmin
    }).filter(userData => {
      return userData.id !== userId
    })
  }
  
  export const filterForNonAdmins = (usersData) => {
    return usersData.filter(userData => {
      return !userData.isAdmin
    })
  }
  
  // UNIVERSAL UTILS:
  
  // Filter out the outdated version of an element from an array
  export const filterOutOldVersion = (prevArr, updatedElem) => {
    const data = (prevArr.filter(elem => {
      if (elem.id && updatedElem.id) {
        return elem.id !== updatedElem.id;
      } else if (elem.cartInventoryId && updatedElem.cartInventoryId) {
        return elem.cartInventoryId !== updatedElem.cartInventoryId
      }
    }))
    return data
  }