import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import * as Location from 'expo-location';

const RoutesScreen = () => {
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setOriginCoords(loc.coords); // Definir a localização atual como origem
    })();
  }, []);

  const getCoordinates = async (place) => {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: place,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        'User-Agent': 'SeuAppDeRotas/1.0 (timao.alenda@gmail.com)',
      },
    });

    if (response.data.length === 0) {
      throw new Error(`Lugar não encontrado: ${place}`);
    }

    const location = response.data[0];
    return {
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
    };
  };

  const buscarRota = async () => {
    try {
      setLoading(true);
      setRouteCoords([]);
      setInfo(null);

      const origem = originText.trim() ? await getCoordinates(originText) : originCoords; // Usa a localização atual se a origem não for fornecida
      if (!origem) {
        throw new Error('Não foi possível determinar a origem.');
      }

      const destino = await getCoordinates(destinationText);

      setOriginCoords(origem);
      setDestCoords(destino);

      const body = {
        coordinates: [
          [origem.longitude, origem.latitude],
          [destino.longitude, destino.latitude],
        ],
        format: 'json',
      };

      const headers = {
        Authorization: 'Bearer 5b3ce3597851110001cf62480c0b4626571f4df79175a1e5a8cb9afb',
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        body,
        { headers }
      );

      const routeData = response.data.routes[0];

      const decoded = polyline.decode(routeData.geometry);
      const coords = decoded.map(([lat, lon]) => ({
        latitude: lat,
        longitude: lon,
      }));

      setRouteCoords(coords);
      setInfo(routeData.summary);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', error.message || 'Falha ao buscar rota.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Destino"
          value={destinationText}
          onChangeText={setDestinationText}
          style={styles.input}
        />
        <Button title="Buscar Rota" onPress={buscarRota} color="#4CAF50" />
      </View>

      <MapView
        style={styles.map}
        region={
          originCoords
            ? {
                latitude: originCoords.latitude,
                longitude: originCoords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : {
                latitude: -23.55052, // Default location (São Paulo)
                longitude: -46.633308,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }
        }
      >
        {originCoords && <Marker coordinate={originCoords} title="Origem" />}
        {destCoords && <Marker coordinate={destCoords} title="Destino" />}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Carregando rota...</Text>
        </View>
      )}

      {info && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Duração: {(info.duration / 60).toFixed(1)} min</Text>
          <Text style={styles.infoText}>Distância: {(info.distance / 1000).toFixed(2)} km</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default RoutesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: 15,
    backgroundColor: '#fff',
    elevation: 5,
    zIndex: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 25,
    fontSize: 16,
  },
  map: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  infoBox: {
    position: 'absolute',
    bottom: 50,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
});
