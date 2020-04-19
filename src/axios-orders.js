import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-burger-builder-9d9c9.firebaseio.com/'
});

export default instance;
