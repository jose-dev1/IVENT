import axios from 'axios';

const GET_PRODUCTOS = async () => {
    try {
        const response = await axios.get(`http://192.168.248.171:3000/productos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
};

export default GET_PRODUCTOS;
