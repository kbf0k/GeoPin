import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Inicio({ navigation }) {
    return (
        <View style={styles.container}>

            {/* Local onde o mapa será renderizado futuramente */}
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>[ MAPA AQUI ]</Text>
            </View>

            {/* Botão de ação */}
            <Pressable style={styles.button} onPress={() => navigation.navigate('UltimoDestino')}>
                <Text style={styles.buttonText}>Ver Último Destino</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingVertical: 50,
        paddingHorizontal: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    mapPlaceholder: {
        width: Dimensions.get('window').width * 0.9,
        height: 300,
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#1289E7',
    },
    mapText: {
        color: '#888',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#2DAF69',
        padding: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignSelf: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});