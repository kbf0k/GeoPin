import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Perfil({ navigation }) {
    return (
        <View style={styles.container}>

            {/* Card do Perfil */}
            <View style={styles.card}>
                <Image
                    source={require('../img/logo.png')} // substitua por sua imagem real
                    style={styles.profileImage}
                />
                <Text style={styles.nome}>João Silva</Text>
                <Text style={styles.email}>joao.silva@email.com</Text>
            </View>

            {/* Botão */}
            <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Sair</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        paddingTop: 0,
    },
    header: {
        width: '100%',
        paddingVertical: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        backgroundColor: '#1289E7',
    },
    headerText: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '85%',
        alignItems: 'center',
        padding: 20,
        marginTop: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#0F4C81',
    },
    nome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F4C81',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: 'gray',
    },
    button: {
        backgroundColor: '#2DAF69',
        padding: 15,
        paddingHorizontal: 80,
        borderRadius: 25,
        marginTop: 50,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});