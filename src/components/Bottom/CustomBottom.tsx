import React, { useRef, useEffect, useState, useContext } from 'react';
import {
	StyleSheet,
	View,
	Modal,
	ScrollView,
	GestureResponderEvent,
	Platform,
	KeyboardAvoidingView,
	StyleProp,
	ViewStyle,
	TouchableOpacity,
	Animated,
	PanResponder,
	Keyboard,
	Text,
	LayoutChangeEvent,
} from 'react-native';
import { COLORS, SCREEN_HIGHT, SCREEN_WIDTH } from '../../constants/constants';

type SheetType = {
	isVisible?: boolean;
	onClose: (event: GestureResponderEvent | any) => void;
	sheetContent?: React.ReactNode | (() => React.ReactNode);
	maximumHeight?: number;
	sheetPadding?: number;
	style?: StyleProp<ViewStyle>;
};

export default function CustomBottomSheet({
	isVisible = false,
	onClose,
	sheetContent,
	maximumHeight = SCREEN_HIGHT / 1.5,
	sheetPadding = 20,
	style,
}: SheetType) {
	const translateY = useRef(new Animated.Value(maximumHeight)).current;
	const [sheetHeight, setSheetHeight] = useState(maximumHeight);
	const [cancelButtonHeight, setCancelButtonHeight] = useState(0)
	const [keyBoardHeight, setKeyBoardHeight] = useState<number>(0)

	useEffect(() => {
		if (isVisible) {
			Animated.spring(translateY, {
				toValue: 0,
				useNativeDriver: true,
			}).start();
		}
	}, [isVisible]);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			(e) => {
				setSheetHeight(maximumHeight / 1.5); // Set height to 50% when keyboard is open
				setKeyBoardHeight(e.startCoordinates?.height ?? 0)
			},
		);

		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setSheetHeight(maximumHeight); // Reset to default when keyboard closes
			},
		);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	// PanResponder for swipe down gesture on drag handle
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5, // Detect downward move
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) {
					translateY.setValue(gestureState.dy);
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > 100) {
					Animated.timing(translateY, {
						toValue: sheetHeight,
						duration: 200,
						useNativeDriver: true,
					}).start(() => onClose(_));
				} else {
					Animated.spring(translateY, {
						toValue: 0,
						useNativeDriver: true,
					}).start();
				}
			},
		}),
	).current;

	return (
		<View style={style}>
			<Modal
				animationType="none"
				visible={isVisible}
				transparent
				onRequestClose={onClose}

			>

				<TouchableOpacity
					style={styles.overlay}
					activeOpacity={1}
					onPress={onClose}
				/>
				<KeyboardAvoidingView
					style={styles.flexContainer}
					behavior={Platform.OS === 'ios' ? 'height' : undefined}>
					<Animated.View
						onLayout={(e: LayoutChangeEvent) => {
							setCancelButtonHeight(e.nativeEvent.layout.height)
						}}
						style={[
							styles.bottomSheet,
							{
								transform: [{ translateY }],
								maxHeight: sheetHeight,
							},
						]}>

						<View
							style={[
								styles.contentContainer,
								{
									paddingHorizontal: sheetPadding,
									maxHeight: sheetHeight - 40, // Adjusted for the drag area
								},
							]}>

							<ScrollView
								bounces={false}
								keyboardShouldPersistTaps="handled"
								showsVerticalScrollIndicator={false}>
								{typeof sheetContent === 'function'
									? sheetContent()
									: sheetContent}
							</ScrollView>
						</View>
					</Animated.View>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	flexContainer: {
		flex: 1,
	},
	overlay: {
		backgroundColor: '#0007',
		flex: 1,
		justifyContent: 'flex-end',
		zIndex: -1,
		position: 'absolute',
		width: '100%',
		height: '100%',
	},
	bottomSheet: {
		backgroundColor: COLORS.white,
		position: 'absolute',
		width: SCREEN_WIDTH,
		zIndex: 999,
		bottom: 0,
		paddingBottom: Platform.OS === 'ios' ? 15 : 15,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	contentContainer: {
		paddingVertical: 15,
	},
	dragContainer: {
		alignItems: 'center',
		paddingVertical: 10,
	},
	// dragHandle: {
	// 	width: 40,
	// 	height: 5,
	// 	backgroundColor: '#ccc',
	// 	borderRadius: 10,
	// },
	cancelButtonContainer: {
		position: 'absolute',
		alignSelf: 'center',
		zIndex: 9999,
	},

	cancelButton: {
		backgroundColor: COLORS.white,
		borderRadius: 100,
		// elevation: 5,
		height: 35,
		width: 35,
		justifyContent: 'center',
		alignItems: 'center'
	},

	cancelButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},

});