import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/constants';
import { FontFamily } from '../../constants/fontFamily';



const SpalshScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    useEffect(() => {
        const t = setTimeout(() => {
            navigation.replace('Drawer')

        }, 5000)
        return () => clearTimeout(t)
    }, [navigation])


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Center Content */}
                <View style={styles.centerContent}>
                    <Text style={styles.logoText}>.pdf editor</Text>
                </View>

                {/* Bottom Tagline */}
                <View style={styles.bottomContainer}>
                    <Text style={styles.tagline}>a smart file editor</Text>
                </View>

            </View>
        </SafeAreaView>
    );
};

export default SpalshScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 60,
        fontWeight: 'bold',
        fontFamily: FontFamily.Bold
    },
    bottomContainer: {
        justifyContent: 'flex-end',
    },
    tagline: {
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: 'bold',
        fontFamily: FontFamily.Bold
    },
});
