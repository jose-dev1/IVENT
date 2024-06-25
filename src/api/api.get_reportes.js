import axios from "axios";

export const GET_REPORTES = async () => {
    try {
        const response = await axios.get(`http://192.168.248.171:3000/productos/salidas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        throw error;
    }
}