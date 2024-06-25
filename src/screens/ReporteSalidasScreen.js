import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { GET_REPORTES } from '../api/api.get_reportes';
import * as Print from 'expo-print';
import Logo from '../../assets/dinero.png';
import { useNavigation } from '@react-navigation/native';

const ReporteSalidasScreen = () => {
    const [reportes, setReportes] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchReportes();

        });

        return unsubscribe;
    }, [navigation]);

    const fetchReportes = async () => {
        try {
            const data = await GET_REPORTES();
            const modifiedReportes = data.map(reporte => ({
                ...reporte,
                fecha: new Date(reporte.fecha).toLocaleDateString(),
            }));
            setReportes(modifiedReportes);
        } catch (error) {
            console.error('Error al obtener reportes:', error);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const htmlContent = generateHTMLReport();
            await Print.printAsync({ html: htmlContent });
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };


    const generateHTMLReport = () => {
        console.log(reportes[0].total_inventario)
        return `
            <html>
                <head>
                    <style>
                        /* Estilos CSS para el informe */
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h2>Reporte de Salidas de Productos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Fecha</th>
                                <th>Precio unidad</th>
                                <th>Precio total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportes.map(reporte => (
            `<tr>
                                    <td>${reporte.nombre}</td>
                                    <td>${reporte.cantidad}</td>
                                    <td>${reporte.fecha}</td>
                                    <td>${reporte.precio_colombiano}</td>
                                    <td>${reporte.total_colombiano}</td>
                                </tr>`
        )).join('')}
                        </tbody>
                    </table>
                    <div class="total_inventario">Total de Inventario: ${reportes[0].total_inventario}</div>
                </body>
            </html>
        `;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={Logo} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Reporte de Salidas</Text>
            </View>
            <ScrollView style={styles.scrollContainer}>
                {reportes.length === 0 ? (
                    <Text style={styles.noDataText}>No hay datos disponibles</Text>
                ) : (
                    <View style={styles.reportContainer}>
                        {reportes.map((reporte, index) => (
                            <View key={index} style={styles.reportItem}>
                                <Text style={styles.reportText}><Text style={styles.boldText}>Producto:</Text> {reporte.nombre}</Text>
                                <Text style={styles.reportText}><Text style={styles.boldText}>Cantidad:</Text> {reporte.cantidad}</Text>
                                <Text style={styles.reportText}><Text style={styles.boldText}>Precio unitario:</Text> {reporte.precio_colombiano}</Text>
                                <Text style={styles.reportText}><Text style={styles.boldText}>Fecha:</Text> {reporte.fecha}</Text>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
                            <Text style={styles.buttonText}>Descargar Reporte PDF</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
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
    scrollContainer: {
        flex: 1,
        marginTop: 10,
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    reportContainer: {
        marginTop: 10,
    },
    reportItem: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    reportText: {
        fontSize: 16,
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold',
    },
    downloadButton: {
        backgroundColor: '#ffc107',
        borderRadius: 10,
        paddingVertical: 14,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ReporteSalidasScreen;
