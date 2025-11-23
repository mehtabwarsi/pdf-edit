// src/navigation/RootNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from "./types";

import SpalshScreen from "../screens/SpalshScreen/splashScreen";
import PdfViewerScreen from "../screens/PdfViewer/pdfViewerScreen";
import DrawerNavigator from "./drawerNavigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="SplashScreen"
        >
            {/* 1️⃣ First screen */}
            <Stack.Screen name="SplashScreen" component={SpalshScreen} />

            {/* 2️⃣ After splash → Drawer (Home + Recent inside) */}
            <Stack.Screen name="Drawer" component={DrawerNavigator} />

            {/* 3️⃣ PDF Viewer stays on stack */}
            <Stack.Screen name="PDFViewerScreen" component={PdfViewerScreen} />
        </Stack.Navigator>
    );
};

export default RootNavigator;
