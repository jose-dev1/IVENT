import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import POST_CREAR from '../api/api.post_crear';
import LogoAgregar from '../../assets/agregar-producto.png';



const CrearProductoScreen = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [unidades, setUnidades] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleCrearProducto = async () => {
        if (!nombre || !descripcion || !precio || !unidades) {
            Alert.alert(
                'Error',
                'Todos los campos son obligatorios',
                [{ text: 'OK', onPress: () => { } }]
            );
            return;
        }

        setIsLoading(true);

        try {
            await POST_CREAR(nombre, precio, descripcion, unidades);
            Alert.alert(
                'Exito',
                'Producto creado correctamente',
                [{ text: 'OK', onPress: () => { } }]
            );
            setNombre('');
            setDescripcion('');
            setPrecio('');
            setUnidades('');

        } catch (error) {
            console.error('Error al crear el producto:', error);
            Alert.alert(
                'Error',
                'Error al crear el producto',
                [{ text: 'OK', onPress: () => { } }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={LogoAgregar} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Crear Nuevo Producto</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Nombre del Producto"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción del Producto"
                multiline
                numberOfLines={4}
                value={descripcion}
                onChangeText={setDescripcion}
            />
            <TextInput
                style={styles.input}
                placeholder="Precio"
                keyboardType="numeric"
                value={precio}
                onChangeText={setPrecio}
            />
            <TextInput
                style={styles.input}
                placeholder="Unidades disponibles"
                keyboardType="numeric"
                value={unidades}
                onChangeText={setUnidades}
            />
            <TouchableOpacity style={styles.button} onPress={handleCrearProducto} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Crear Producto</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffc107',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#f8f9fa',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        width: '100%',
        backgroundColor: '#ffc107',
        borderRadius: 10,
        paddingVertical: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default CrearProductoScreen;
