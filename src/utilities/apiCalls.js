const apiUrl =  `${process.env.DATABASE_URL}`

export const apiCall = async (url, method = 'GET', token, body) => {
    let data = false;
    try {
      const response = await fetch(apiUrl + url, setToken(getFetchOptions(method, body), token));
      data = await response.json();
  
      if (data.error) {
        throw data.error;
      }
    } catch (error) {
      console.error(error);
    }
    return data;
  }
  
  const getFetchOptions = (method, body) => {
    return {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
  
  const setToken = (body, token) => {
    const localToken = JSON.parse(localStorage.getItem('grace-shopper-jwt'));
    if (localToken) {
      body.headers = Object.assign(body.headers, { 'Authorization': `Bearer ${localToken}` })
      return body;
    } else if (token) { 
      body.headers = Object.assign(body.headers, { 'Authorization': `Bearer ${token}` }) 
    }
    return body;
  }
  
  export const fetchAllUsers = async () => {
    const data = await apiCall('/users');
    return data || []
  }
  
  export const loginUser = async (username, password) => {
    const data = await apiCall('/users/login', 'POST', null, { username, password });
    return data || []
  }
  
  export const registerUser = async (username, password, address, fullname, email) => {
    const data = await apiCall('/users/register', 'POST', null, {
      username,
      password,
      address,
      fullname,
      email
    });
    return data || []
  }
  
  export const getLocalUser = async () => {
    const data = await apiCall('/users/me');
    return data || []
  }
  
  export const fetchCart = async () => {
    const data = await apiCall('/cart');
    return data || []
  }
  
  export const fetchInventory = async () => {
      const data = await apiCall('/inventory');
      return data || []
  }
  
  export const fetchReviewsByItemId = async (itemId) => {
      const data = await apiCall(`/reviews/item/${itemId}`);
      return data || []
  }
  
  export const postReview = async (token, { userId, username, itemId, stars, description }) => {
      const data = await apiCall('/reviews', 'POST', token, {
        userId,
        username,
        itemId,
        stars,
        description
      })
      return data || []
  }
