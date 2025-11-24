import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RecentScreen from '../screens/Recent/recentScreen';
import HomeScreen from '../screens/Home/homeScreen';
import { COLORS } from '../constants/constants';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#FFFFFF', 
                },
                drawerActiveTintColor: COLORS.black,      
                drawerActiveBackgroundColor: '#F5F5F5', 
                drawerInactiveTintColor: 'rgba(0,0,0,0.5)'
            }}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Recent" component={RecentScreen} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
