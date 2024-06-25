import axios from "axios";

const POST_SALIDA = async (id, unidades) => {
    try {
        const response = await axios.post(`http://192.168.248.171:3000/productos/salidas`, {
            id: id,
            unidades: unidades
        });
        return response.data;
    } catch (error) {
        console.error('Error al registrar salida:', error);
        throw error;
    }
};

export default POST_SALIDA;