import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import polyline from '@mapbox/polyline';

const RouteScreen = ({ route }) => {
    const { origin, destination } = route.params;
    const [routeCoords, setRouteCoords] = useState([]);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [destCoords, setDestCoords] = useState(null);

    // Buscar coordenadas pelo nome do destino
    useEffect(() => {
        const getCoordinatesFromName = async () => {
            try {
                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: destination,
                        format: 'json',
                        addressdetails: 1,
                        limit: 1,
                    },
                    headers: {
                        'User-Agent': 'MeuAppDeRotas/GeoPin (geo@exemplo.com)',
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
    }, []);

    // Traçar rota após obter coordenadas do destino
    useEffect(() => {
        if (!destCoords) return;

        const fetchRoute = async () => {
            try {
                const body = {
                    coordinates: [
                        [origin.longitude, origin.latitude],
                        [destCoords.longitude, destCoords.latitude],
                    ],
                };

                const headers = {
                    Authorization: 'Bearer SEU_TOKEN_AQUI', // Substitua pelo seu token válido do OpenRouteService
                    'Content-Type': 'application/json',
                };

                const response = await axios.post(
                    'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
                    body,
                    { headers }
                );

                const routeData = response.data;

                if (!routeData || !routeData.features?.[0]?.geometry) {
                    console.error('Dados inválidos da rota:', response.data);
                    Alert.alert('Erro', 'Não foi possível traçar a rota.');
                    return;
                }

                const geometry = routeData.features[0].geometry;
                const decoded = polyline.decode(geometry.coordinates.map(([lng, lat]) => [lat, lng])); // se necessário
                const coords = decoded.map(([lat, lon]) => ({
                    latitude: lat,
                    longitude: lon,
                }));

                setRouteCoords(coords);
                setInfo(routeData.features[0].properties.summary);
            } catch (error) {
                console.error('Erro ao traçar rota:', error);
                Alert.alert('Erro', 'Falha ao traçar rota.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [destCoords]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2DAF69" />
                <Text style={{ marginTop: 10 }}>Carregando rota...</Text>
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
                {destCoords && <Marker coordinate={destCoords} title="Destino" />}
                {routeCoords.length > 0 && (
                    <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="#2DAF69" />
                )}
            </MapView>
            {info && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Distância: {info.distance}m</Text>
                    <Text style={styles.infoText}>Duração: {info.duration}s</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    infoBox: {
        backgroundColor: '#FFF',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RouteScreen;