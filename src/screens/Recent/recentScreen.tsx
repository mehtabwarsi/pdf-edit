import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants/constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header/Header'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/types'
import { useNavigation } from '@react-navigation/native'
import { NavProps } from '../../utills/types'


const RecentScreen = () => {
    const navigation = useNavigation<NavProps>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{flex:1,margin:16}}>
                <Header onClick={() => navigation.openDrawer()} />
                <View style={styles.container}>
                    <Text style={styles.textStyle}>RecentScreen</Text>
                </View>
            </View>

        </SafeAreaView>

    )
}

export default RecentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    textStyle: {
        color: COLORS.black
    }
})