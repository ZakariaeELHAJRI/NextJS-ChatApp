import axios from 'axios';

export const fetchConversations = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('http://localhost:8000/api/customconversations/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations: ', error);
    return [];
  }
};
