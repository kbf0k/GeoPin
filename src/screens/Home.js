import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Inicio({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text_titulo}>Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'rgb(100, 3, 19)',
        padding: 20,
    },
    text_titulo: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        maxWidth: 350,
        alignItems: 'center',
        shadowColor: 'black',
        boxShadow: '0px 0px 8px white',
        elevation: 5,
        borderWidth: 1,
        borderColor: 'white',
    },
    text_subtitulo: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'rgb(100, 3, 19)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 15,
        paddingHorizontal: 55,
    },
    text_paragrafo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'rgb(100, 3, 19)',
        textAlign: 'center',
        padding: 25
    },
    button: {
        padding: 15,
        paddingHorizontal: 100,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'rgb(100, 3, 19)',
    },
});