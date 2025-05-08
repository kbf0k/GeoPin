import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, StyleSheet } from 'react-native';

import RoutesScreen from './src/screens/RoutesScreen';
import Inicio from './src/screens/Home';
import Perfil from './src/screens/Perfil';
import UltimoDestino from './src/screens/UltimoDestino';

import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Header personalizado
function CustomHeader({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      <Image
        style={styles.logo_nav}
        source={require('./src/img/logo.png')}
        resizeMode="contain"
      />
    </View>
  );
}

// Tabs principais
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route, navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        tabBarStyle: {
          backgroundColor: '#00b5b8',
          borderTopWidth: 0,
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Inicio':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'UltimoDestino':
              iconName = focused ? 'map' : 'map-outline';
              break;
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen name="Inicio" component={Inicio} />
      <Tab.Screen name="UltimoDestino" component={UltimoDestino} />
    </Tab.Navigator>
  );
}

// Navegação principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Agora MainTabs será a primeira tela exibida */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="RoutesScreen" component={RoutesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#00b5b8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logo_nav: {
    width: 200,
    height: 70,
  },
});
