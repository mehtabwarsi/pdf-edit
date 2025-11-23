import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import React from 'react';
import { COLORS, SCREEN_WIDTH } from '../../constants/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pick } from '@react-native-documents/picker';
import UploadIcon from '../../assets/svgIcon/upload';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import RNFS from 'react-native-fs';
import { FontFamily } from '../../constants/fontFamily';
import Header from '../../components/Header/Header';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NavProps } from '../../utills/types';



const HomeScreen = () => {

  const navigation = useNavigation<NavProps>();

  // Copy content:// file to app cache (Android 10+)
  const copyContentUriToCache = async (uri: string) => {
    if (Platform.OS === 'android' && uri.startsWith('content://')) {
      const destPath = `${RNFS.CachesDirectoryPath}/temp.pdf`;
      await RNFS.copyFile(uri, destPath);
      return `file://${destPath}`;
    }
    return uri; // iOS or file:// URIs
  };

  const handlePdfPicker = async () => {
    try {
      const files = await pick({
        type: ['application/pdf'],
        allowMultiSelection: false,
      });

      if (files && files.length > 0) {
        const file = files[0];
        if (file) {
          const finalUri = await copyContentUriToCache(file.uri); // fix for Android
          navigation.navigate('PDFViewerScreen', { fileUri: finalUri });
        }
      }
    } catch (error: any) {
      if (error?.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled the picker');
        return;
      }
      Alert.alert('Error', 'Unable to pick PDF');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, margin: 16 }}>
        <Header onClick={() => navigation.openDrawer()} />
        <View style={styles.container}>
          <Text style={styles.textStyle}>.pdf editor</Text>

          <TouchableOpacity onPress={handlePdfPicker} activeOpacity={0.8} style={styles.pdfbutton}>
            <UploadIcon height={24} width={24} />
            <Text style={styles.pdfButtonText}>Upload a PDF</Text>
          </TouchableOpacity>
        </View>

      </View>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: 40,
    fontFamily: FontFamily.Regular
  },
  pdfbutton: {
    marginTop: 10,
    backgroundColor: COLORS.white,
    elevation: 2,
    width: SCREEN_WIDTH - 40,
    paddingVertical: 20,
    flexDirection: 'row',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  pdfButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: FontFamily.SemiBold
  },
});
