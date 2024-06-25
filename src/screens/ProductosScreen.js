import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import GET_PRODUCTOS from '../api/api.get_producto';
import Logo from '../../assets/paquete-o-empaquetar.png';
import POST_SALIDA from '../api/api.post_salida';
import PUT_UNIDADES from '../api/api.put_unidades';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const ProductosScreen = () => {
    const [productos, setProductos] = useState([]);
    const [modalVisibleAgregar, setModalVisibleAgregar] = useState(false);
    const [modalVisibleSacar, setModalVisibleSacar] = useState(false);
    const [cantidadUnidadesAgregar, setCantidadUnidadesAgregar] = useState(1);
    const [cantidadUnidadesSacar, setCantidadUnidadesSacar] = useState(0);
    const [productoId, setProductoId] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            cargarProductos();
        });

        return unsubscribe;
    }, [navigation]);

    const cargarProductos = async () => {
        try {
            const data = await GET_PRODUCTOS();
            setProductos(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    const handleSacarUnidades = async () => {
        if (!productoId || cantidadUnidadesSacar <= 0) {
            console.warn('Debe seleccionar un producto y una cantidad válida de unidades a sacar.');
            return;
        }

        const productoSeleccionado = productos.find(prod => prod.id === productoId);

        if (cantidadUnidadesSacar > productoSeleccionado.unidades) {
            Alert.alert(
                'Error',
                'Está superando la cantidad disponible',
                [{ text: 'OK', onPress: () => { } }]
            );
            return;
        }

        try {
            await POST_SALIDA(productoId, cantidadUnidadesSacar);
            console.log('Se ha registrado la salida de ' + cantidadUnidadesSacar + ' unidades del producto ' + productoId);
            cargarProductos();

            setModalVisibleSacar(false);
            setCantidadUnidadesSacar(1);
            setProductoId(null);

            Alert.alert(
                'Exito',
                'Unidades sacadas con exito',
                [{ text: 'OK', onPress: () => { } }]
            );


        } catch (error) {
            console.error('Error al sacar unidades:', error);
        }
    };

    const handleAgregarUnidades = async () => {
        if (!productoId || cantidadUnidadesAgregar <= 0) {
            console.warn('Debe seleccionar un producto y una cantidad válida de unidades a agregar.');
            return;
        }

        try {
            const response = await PUT_UNIDADES(productoId, productos.find(prod => prod.id === productoId).unidades + cantidadUnidadesAgregar);
            console.log('Se ha actualizado la cantidad de unidades del producto ' + productoId);
            cargarProductos();

            setModalVisibleAgregar(false);
            setCantidadUnidadesAgregar(1);
            setProductoId(null);

            Alert.alert(
                'Exito',
                'Unidades agregadas con exito',
                [{ text: 'OK', onPress: () => { } }]
            );
        } catch (error) {
            console.error('Error al agregar unidades:', error);
        }
    };

    const renderProducto = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.productoHeader}>
                    <View style={styles.productoInfo}>
                        <Text style={styles.productoNombre}>{item.nombre}</Text>
                        <Text style={styles.productoDescripcion}>{item.descripcion}</Text>
                    </View>
                    <Image source={Logo} style={styles.logoProducto} />
                </View>
                <Text style={[styles.productoPrecio, { color: item.unidades > 0 ? 'green' : 'red' }]}>
                    Precio: {item.precio} COP
                </Text>
                <Text style={[styles.productoPrecio, { color: item.unidades > 0 ? 'green' : 'red' }]}>
                    Disponibles: {item.unidades}
                </Text>
                <View style={styles.contenedorBotones}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: item.unidades > 0 ? 'gray' : '#d2d2d2' }]}
                        onPress={() => {
                            setProductoId(item.id);
                            setModalVisibleSacar(true);
                        }}
                        disabled={item.unidades <= 0}
                    >
                        <MaterialIcons name="remove-shopping-cart" size={24} color={item.unidades > 0 ? 'white' : 'gray'} />
                        <Text style={styles.buttonText}> Sacar Unidades</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#ffc107' }]}
                        onPress={() => {
                            setProductoId(item.id);
                            setModalVisibleAgregar(true);
                        }}
                    >
                        <MaterialIcons name="add-shopping-cart" size={24} color="white" />
                        <Text style={styles.buttonText}> Agregar Unidades</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Productos</Text>
            <FlatList
                data={productos}
                renderItem={renderProducto}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.flatListContent}
                extraData={productos}
            />

            {/* Modal para Agregar Unidades */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleAgregar}
                onRequestClose={() => {
                    setModalVisibleAgregar(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Ingrese la cantidad de unidades a agregar:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setCantidadUnidadesAgregar(Number(text))}
                            value={cantidadUnidadesAgregar.toString()}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleAgregarUnidades}>
                            <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleSacar}
                onRequestClose={() => {
                    setModalVisibleSacar(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Ingrese la cantidad de unidades a sacar:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setCantidadUnidadesSacar(Number(text))}
                            value={cantidadUnidadesSacar.toString()}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleSacarUnidades}>
                            <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    flatListContent: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    cardContent: {
        padding: 15,
    },
    productoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoProducto: {
        width: 60,
        height: 60,
        marginRight: 50,
        marginTop: 15,
    },
    productoInfo: {
        flex: 1,
    },
    productoNombre: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productoDescripcion: {
        fontSize: 14,
        marginBottom: 10,
    },
    productoPrecio: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    contenedorBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    modalButton: {
        backgroundColor: '#ffc107',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
});

export default ProductosScreen;
