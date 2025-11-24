import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ActivityIndicator, Alert, Button } from 'react-native';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';

const HTMLEditorScreen = ({ route }: any) => {
    const { fileUri } = route.params;

    const webviewRef = useRef<any>(null);  // <-- IMPORTANT (useRef)

    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadHtmlFile = useCallback(async () => {
        try {
            const content = await RNFS.readFile(fileUri, 'utf8');
            setHtmlContent(content);
        } catch (error) {
            Alert.alert("Error", "Unable to load HTML file");
        } finally {
            setLoading(false);
        }
    }, [fileUri]);

    useEffect(() => {
        loadHtmlFile();
    }, [loadHtmlFile]);

    const injectedJS = `
    document.body.contentEditable = true;
    document.designMode = "on";
    true;
  `;

    /** Save Edited HTML */
    const saveHtml = () => {
        webviewRef.current.injectJavaScript(`
      window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
      true;
    `);
    };

    /** Receive HTML From WebView */
    const onMessage = (event: any) => {
        const updatedHTML = event.nativeEvent.data;

        // SAVE TO FILE
        const savePath = `${RNFS.DocumentDirectoryPath}/edited.html`;

        RNFS.writeFile(savePath, updatedHTML, 'utf8')
            .then(() => Alert.alert("Saved", "HTML file updated"))
            .catch(() => Alert.alert("Error", "Failed to save HTML"));
    };

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 40 }} />
            ) : (
                <>
                    <Button title="💾 Save" onPress={saveHtml} />

                    <WebView
                        ref={webviewRef}                      // <-- useRef connected
                        originWhitelist={['*']}
                        source={{ html: htmlContent || "" }}
                        injectedJavaScript={injectedJS}
                        javaScriptEnabled
                        domStorageEnabled
                        onMessage={onMessage}
                    />
                </>
            )}
        </View>
    );
};

export default HTMLEditorScreen;
