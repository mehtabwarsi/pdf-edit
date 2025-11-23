import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RecentScreen from '../screens/Recent/recentScreen';
import HomeScreen from '../screens/Home/homeScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,  
            }}
        >
            {/* Drawer Items */}
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Recent" component={RecentScreen} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
