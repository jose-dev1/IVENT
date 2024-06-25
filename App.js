import { StyleSheet, } from 'react-native';
import DrawerNavigator from './src/navigation/DrawerNavigator';

export default function App() {
  return (

    <DrawerNavigator />

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
