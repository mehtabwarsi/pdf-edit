import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ActivityIndicator, Alert, TouchableOpacity, Text, StyleSheet, Keyboard, Animated, TextInput, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomBottomSheet from '../../components/Bottom/CustomBottom';
import { COLORS } from '../../constants/constants';

const HTMLEditorScreen = ({ route }: any) => {
	const { fileUri } = route.params;

	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const webviewRef = useRef<any>(null);
	const [htmlContent, setHtmlContent] = useState<string | null>(null);
	const [selectedText, setSelectedText] = useState<string>('');

	const keyboardHeight = useRef(new Animated.Value(20)).current;

	// Keyboard events for floating button
	useEffect(() => {
		const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
			Animated.timing(keyboardHeight, {
				toValue: e.endCoordinates.height + 20,
				duration: 250,
				useNativeDriver: false,
			}).start();
		});
		const hideSub = Keyboard.addListener('keyboardDidHide', () => {
			Animated.timing(keyboardHeight, {
				toValue: 20,
				duration: 250,
				useNativeDriver: false,
			}).start();
		});
		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, []);

	// Load HTML file
	const loadHtmlFile = useCallback(async () => {
		try {
			const content = await RNFS.readFile(fileUri, 'utf8');
			setHtmlContent(content);
		} catch (error) {
			Alert.alert("Error", "Unable to load HTML file");
		}
	}, [fileUri]);

	useEffect(() => {
		loadHtmlFile();
	}, [loadHtmlFile]);

	// Injected JS to make content editable and track selection
	const injectedJS = `
		document.body.contentEditable = true;
		document.designMode = "on";

		document.addEventListener("selectionchange", function() {
			const sel = window.getSelection();
			const selected = sel.toString();
			if(selected.length > 0){
				const range = sel.getRangeAt(0);
				// Remove previous span if exists
				const oldSpan = document.getElementById('selected-text');
				if(oldSpan){
					const parent = oldSpan.parentNode;
					while(oldSpan.firstChild){
						parent.insertBefore(oldSpan.firstChild, oldSpan);
					}
					parent.removeChild(oldSpan);
				}
				// Wrap selection in new span
				const span = document.createElement("span");
				span.id = "selected-text";
				range.surroundContents(span);
				window.ReactNativeWebView.postMessage(selected);
			}
		});
		true;
	`;

	// Execute formatting commands
	const runCommand = (command: string, value: string = '') => {
		webviewRef.current.injectJavaScript(`
			const selSpan = document.getElementById('selected-text');
			if(selSpan){
				selSpan.focus();
				document.execCommand("${command}", false, "${value}");
			}
			true;
		`);
	};

	// Save HTML
	const saveHtml = () => {
		webviewRef.current.injectJavaScript(`
			window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
			true;
		`);
	};

	// Update selected text in real-time
	const updateSelectedText = (newText: string) => {
		setSelectedText(newText);
		webviewRef.current.injectJavaScript(`
			const span = document.getElementById('selected-text');
			if(span){
				span.innerText = \`${newText}\`;
			}
			true;
		`);
	};

	const onMessage = async (event: any) => {
		const message = event.nativeEvent.data;

		// HTML content
		if (message.startsWith('<!DOCTYPE') || message.startsWith('<html')) {
			const savePath = `${RNFS.DocumentDirectoryPath}/edited.html`;
			try {
				await RNFS.writeFile(savePath, message, 'utf8');
				Alert.alert("Saved Successfully", "Your HTML content has been updated.");
			} catch (e) {
				Alert.alert("Error", "Failed to save HTML");
			}
		} else {
			// Selected text
			setSelectedText(message);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
			<View style={{ flex: 1 }}>
				{/* WebView */}
				{!htmlContent ? (
					<ActivityIndicator size="large" style={{ marginTop: 40 }} />
				) : (
					<WebView
						ref={webviewRef}
						originWhitelist={['*']}
						source={{ html: htmlContent }}
						injectedJavaScript={injectedJS}
						javaScriptEnabled
						domStorageEnabled
						onMessage={onMessage}
						style={{ flex: 1 }}
					/>
				)}

				{/* Floating Edit Button */}
				<Animated.View style={{ position: 'absolute', right: 20, bottom: keyboardHeight }}>
					<TouchableOpacity
						style={styles.editBtn}
						onPress={() => setIsEditSheetOpen(true)}
					>
						<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Edit</Text>
					</TouchableOpacity>
				</Animated.View>

				{/* Bottom Sheet */}
				<CustomBottomSheet
					isVisible={isEditSheetOpen}
					onClose={() => setIsEditSheetOpen(false)}
					sheetContent={() => (
						<ScrollView style={{ gap: 12 }}>
							<Text style={styles.sheetTitle}>Edit Text</Text>

							<TextInput
								style={styles.textInput}
								value={selectedText}
								onChangeText={updateSelectedText}
								placeholder="Edit selected text here"
							/>

							<TouchableOpacity style={styles.optionRow} onPress={() => runCommand("bold")}>
								<Text style={styles.optionText}>Bold</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.optionRow} onPress={() => runCommand("italic")}>
								<Text style={styles.optionText}>Italic</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.optionRow} onPress={() => runCommand("underline")}>
								<Text style={styles.optionText}>Underline</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.optionRow} onPress={() => runCommand("backColor", "yellow")}>
								<Text style={styles.optionText}>Highlight</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.optionRow} onPress={() => runCommand("foreColor", "red")}>
								<Text style={styles.optionText}>Text Color</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.optionRow} onPress={() => runCommand("insertImage", "https://placekitten.com/200/200")}>
								<Text style={styles.optionText}>Add Image</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.optionRow} onPress={saveHtml}>
								<Text style={styles.optionText}>Save Changes</Text>
							</TouchableOpacity>
						</ScrollView>
					)}
				/>
			</View>
		</SafeAreaView>
	);
};

export default HTMLEditorScreen;

const styles = StyleSheet.create({
	editBtn: {
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
	textInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 10,
		marginBottom: 12,
		fontSize: 16,
	},
});
