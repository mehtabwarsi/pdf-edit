import { DocumentPickerResponse } from "@react-native-documents/picker";

export type RootStackParamList = {
    SplashScreen: undefined,
    HomeScreen: undefined,
    PDFViewerScreen: { fileUri:DocumentPickerResponse }
};
