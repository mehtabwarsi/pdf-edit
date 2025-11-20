import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

const SpalshScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {

        const t = setTimeout(() => {
            navigation.navigate('HomeScreen')
        }, 5000)

        return () => clearTimeout(t)
    }, [navigation])
    return (
        <View style={styles.container}>
            <Text>SpalshScreen</Text>
        </View>
    )
}

export default SpalshScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    textStyle: {
        textAlign: 'center',
        color: 'black'
    }
})