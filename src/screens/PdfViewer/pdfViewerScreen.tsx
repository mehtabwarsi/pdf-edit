import { StyleSheet, View, Dimensions, Platform, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Pdf from 'react-native-pdf';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import RNFS from 'react-native-fs';
import { COLORS } from '../../constants/constants';
import EditIcon from '../../assets/svgIcon/editIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavProps } from '../../utills/types';
import CustomBottomSheet from '../../components/Bottom/CustomBottom';
import { Text } from 'react-native-gesture-handler';

const PdfViewerScreen = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, 'PDFViewerScreen'>>();
  const { fileUri } = params;

  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const navigation = useNavigation<NavProps>();

  const getUri = () => {
    if (!fileUri) return null;
    if (typeof fileUri === 'string') return fileUri;
    if ('uri' in fileUri) return fileUri?.uri;
    return null;
  };

  useEffect(() => {
    const preparePdf = async () => {
      const uri = getUri();
      if (!uri) {
        console.log('No valid PDF URI found');
        return;
      }

      try {
        if (Platform.OS === 'android' && uri.startsWith('content://')) {
          const destPath = `${RNFS.CachesDirectoryPath}/temp.pdf`;
          await RNFS.copyFile(uri, destPath);
          setPdfPath(`file://${destPath}`);
        } else {
          setPdfPath(uri);
        }
      } catch (error) {
        console.log('Error copying PDF to cache:', error);
      }
    };

    preparePdf();
  }, [fileUri]);

  if (!pdfPath) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.container}>
        <Pdf
          source={{ uri: pdfPath, cache: true }}
          onLoadComplete={(numberOfPages) => console.log(`Total pages: ${numberOfPages}`)}
          onPageChanged={(page) => console.log(`Current page: ${page}`)}
          onError={(error) => {
            console.log('PDF load error:', error);
            Alert.alert(
              "PDF Error",
              // @ts-ignore
              error?.message || "Unable to load this PDF file.",
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          }}
          style={styles.pdf}
        />

        {/* ROUND EDIT BUTTON */}
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.editBtn}
          onPress={() => setIsEditSheetOpen(true)}
        >
          <EditIcon height={26} width={26} fill="#fff" />
        </TouchableOpacity>

        {/* ---- CUSTOM BOTTOM SHEET ---- */}
        <CustomBottomSheet
          isVisible={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          sheetContent={() => (
            <View style={{ gap: 12 }}>

              <Text style={styles.sheetTitle}>Edit PDF</Text>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => console.log("Add Signature")}
              >
                <Text style={styles.optionText}>Add Signature</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => console.log("Add Text")}
              >
                <Text style={styles.optionText}>Add Text</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => console.log("Save Changes")}
              >
                <Text style={styles.optionText}>Save Changes</Text>
              </TouchableOpacity>

            </View>
          )}
        />

      </View>
    </SafeAreaView>
  );
};

export default PdfViewerScreen;

/* ====================== STYLES ======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  editBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.black,

    width: 60,
    height: 60,
    borderRadius: 30,

    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },

  /* BOTTOM SHEET */
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
  },

  optionRow: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
});
