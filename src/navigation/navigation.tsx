// src/navigation/RootNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from "./types";
import SpalshScreen from "../screens/SpalshScreen/splashScreen";
import HomeScreen from "../screens/Home/homeScreen";


const Stack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false

            }}
            initialRouteName="SplashScreen"
        >
            <Stack.Screen name="SplashScreen" component={SpalshScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
    );
};

export default RootNavigator;
