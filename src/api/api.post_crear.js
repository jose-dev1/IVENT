import axios from "axios";
const POST_CREAR = async (nombre, precio, descripcion, unidades) => {
    try {
        const response = await axios.post(`http://192.168.248.171:3000/productos`, {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            unidades: unidades
        });
        return response.data;
    } catch (error) {
        console.error('Error al registrar producto:', error);
        throw error;
    }
};

export default POST_CREAR;