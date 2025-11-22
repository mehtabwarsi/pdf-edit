import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Pdf from 'react-native-pdf';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import RNFS from 'react-native-fs';

const PdfViewerScreen = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, 'PDFViewerScreen'>>();
  const { fileUri } = params;

  const [pdfPath, setPdfPath] = useState<string | null>(null);

  // Helper: safely get the URI string
  const getUri = () => {
    if (!fileUri) return null;
    if (typeof fileUri === 'string') return fileUri;
    if ('uri' in fileUri) return fileUri.uri;
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
        // Android content URI needs to be copied to cache
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

  if (!pdfPath) return null; // wait until PDF is ready

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: pdfPath, cache: true }}
        onLoadComplete={(numberOfPages) => console.log(`Total pages: ${numberOfPages}`)}
        onPageChanged={(page) => console.log(`Current page: ${page}`)}
        onError={(error) => console.log('PDF load error:', error)}
        style={styles.pdf}
      />
    </View>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  pdf: { flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});
