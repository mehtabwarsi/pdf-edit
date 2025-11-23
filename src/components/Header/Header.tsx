import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import HambugerIcon from '../../assets/svgIcon/hambuger'

interface Props {
    onClick: () => void,
}

const Header = ({ onClick }: Props) => {
    return (
        <TouchableOpacity style={styles.headerConatiner} onPress={onClick}>
            <HambugerIcon height={28} width={28} />
        </TouchableOpacity>
    )
}

export default Header

const styles = StyleSheet.create({
    headerConatiner: {
        justifyContent: 'flex-start'
    }
})