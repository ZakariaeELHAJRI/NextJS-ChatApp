// data.js

import axios from 'axios';


export const fetchUsers = async () => {
    try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('http://localhost:8000/api/friends/', {
      headers: {  
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 

  } catch (error) {
    console.error('Error fetching users:', error);
    return []; 
  }
};
