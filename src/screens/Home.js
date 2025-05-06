import React, { useEffect, useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permissão de localização negada');
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        })();
    }, []);

    const handleNavigate = () => {
        if (!destination || !location) return;
        navigation.navigate('RoutesScreen', {
            destination,
            origin: location,
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Digite o destino"
                value={destination}
                onChangeText={setDestination}
            />

            <Pressable style={styles.button} onPress={handleNavigate}>
                <Text style={styles.buttonText}>Ir para rota</Text>
            </Pressable>

            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker coordinate={location} title="Você está aqui" />
                </MapView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#2DAF69',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    map: {
        width: Dimensions.get('window').width * 0.9,
        height: 300,
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1289E7',
    },
});