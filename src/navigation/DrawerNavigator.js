import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ProductosScreen from '../screens/ProductosScreen';
import CrearProductoScreen from '../screens/CrearProductoScreen';
import ReporteSalidasScreen from '../screens/ReporteSalidasScreen';
import LogoAgregar from '../../assets/agregar-producto.png'

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Productos">
                <Drawer.Screen name="Productos" component={ProductosScreen} />
                <Drawer.Screen name="Crear Producto" component={CrearProductoScreen} />
                <Drawer.Screen name="Reporte de Salidas" component={ReporteSalidasScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default DrawerNavigator;
