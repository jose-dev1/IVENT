import axios from "axios";


const PUT_UNIDADES = async (id, unidades) => {
    console.log(id, unidades)
    try {
        const response = await axios.put(`http://192.168.248.171:3000/productos/unidades/${id}`, {
            unidades: unidades
        });
        return response.data;
    } catch (error) {
        console.error('Error al modificar unidades:', error);
        throw error;
    }
}

export default PUT_UNIDADES;