import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import polyline from '@mapbox/polyline';

const Rotas = ({ route }) => {
    const { origin, destination } = route.params;
    const [routeCoords, setRouteCoords] = useState([]);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [destCoords, setDestCoords] = useState(null);

    useEffect(() => {
        const getCoordinatesFromName = async () => {
            try {
                setLoading(true); // reinicia o loading ao mudar destino
                setRouteCoords([]); // limpa rota anterior

                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: destination,
                        format: 'json',
                        addressdetails: 1,
                        limit: 1,
                    },
                    headers: {
                        'User-Agent': 'SeuAppDeRotas/1.0 (seuemail@exemplo.com)',
                    },
                });

                if (response.data.length === 0) {
                    Alert.alert('Erro', 'Destino não encontrado.');
                    return;
                }

                const location = response.data[0];
                const coords = {
                    latitude: parseFloat(location.lat),
                    longitude: parseFloat(location.lon),
                };

                setDestCoords(coords);
            } catch (error) {
                console.error('Erro ao buscar coordenadas:', error);
                Alert.alert('Erro', 'Falha ao buscar o destino.');
            }
        };

        getCoordinatesFromName();
    }, [destination]); // <- Atualiza sempre que o destination mudar


    useEffect(() => {
        if (!destCoords) return;

        const fetchRoute = async () => {
            try {
                const body = {
                    coordinates: [
                        [origin.longitude, origin.latitude],
                        [destCoords.longitude, destCoords.latitude],
                    ],
                    format: 'json',
                };

                const headers = {
                    Authorization: '5b3ce3597851110001cf624853cb544212a14fcf9091355fa21b2d80',
                    'Content-Type': 'application/json',
                };

                const response = await axios.post(
                    'https://api.openrouteservice.org/v2/directions/driving-car',
                    body,
                    { headers }
                );

                const routeData = response.data?.routes?.[0];
                if (!routeData || !routeData.geometry) {
                    console.error('Dados inválidos da rota:', response.data);
                    Alert.alert('Erro', 'Não foi possível traçar a rota.');
                    return;
                }

                const decoded = polyline.decode(routeData.geometry);
                const coords = decoded.map(([lat, lon]) => ({
                    latitude: lat,
                    longitude: lon,
                }));

                setRouteCoords(coords);
                setInfo(routeData.summary);
            } catch (error) {
                console.error('Erro ao traçar rota:', error);
                Alert.alert('Erro', 'Falha ao obter a rota.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [destCoords, origin]); // <- Recalcula rota se origin ou destino mudarem


    if (loading || !destCoords) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando rota...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={origin} title="Origem" />
                <Marker coordinate={destCoords} title="Destino" />
                {routeCoords.length > 0 && (
                    <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="blue" />
                )}
            </MapView>
            {info && (
                <View style={styles.infoBox}>
                    <Text>Duração: {(info.duration / 60).toFixed(1)} min</Text>
                    <Text>Distância: {(info.distance / 1000).toFixed(2)} km</Text>
                </View>
            )}
        </View>
    );
};

export default Rotas;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    infoBox: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 5,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});