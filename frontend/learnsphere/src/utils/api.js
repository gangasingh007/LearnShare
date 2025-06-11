export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');