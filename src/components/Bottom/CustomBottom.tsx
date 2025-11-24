import React, { useRef, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Platform,
	KeyboardAvoidingView,
	Animated,
	PanResponder,
	Keyboard,
} from 'react-native';
import { COLORS, SCREEN_HIGHT, SCREEN_WIDTH } from '../../constants/constants';

type SheetType = {
	isVisible?: boolean;
	onClose: () => void;
	sheetContent?: React.ReactNode | (() => React.ReactNode);
	maximumHeight?: number;
	sheetPadding?: number;
};

export default function CustomBottomSheet({
	isVisible = false,
	onClose,
	sheetContent,
	maximumHeight = SCREEN_HIGHT / 1.5,
	sheetPadding = 20,
}: SheetType) {
	const translateY = useRef(new Animated.Value(maximumHeight)).current;
	const [sheetHeight, setSheetHeight] = useState(maximumHeight);

	// Keyboard Handling
	useEffect(() => {
		const showSub = Keyboard.addListener('keyboardDidShow', () => {
			setSheetHeight(maximumHeight);
			Animated.timing(translateY, {
				toValue: 0,
				duration: 250,
				useNativeDriver: true,
			}).start();
		});
		const hideSub = Keyboard.addListener('keyboardDidHide', () => {
			setSheetHeight(maximumHeight);
			Animated.timing(translateY, {
				toValue: 0,
				duration: 250,
				useNativeDriver: true,
			}).start();
		});
		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, [maximumHeight]);

	// Show/Hide animation
	useEffect(() => {
		if (isVisible) {
			Animated.spring(translateY, {
				toValue: 0,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(translateY, {
				toValue: sheetHeight,
				duration: 200,
				useNativeDriver: true,
			}).start();
		}
	}, [isVisible, sheetHeight]);

	// Swipe down gesture
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > 100) {
					Animated.timing(translateY, {
						toValue: sheetHeight,
						duration: 200,
						useNativeDriver: true,
					}).start(onClose);
				} else {
					Animated.spring(translateY, {
						toValue: 0,
						useNativeDriver: true,
					}).start();
				}
			},
		})
	).current;

	return (
		<Animated.View
			style={[
				styles.bottomSheet,
				{ transform: [{ translateY }], maxHeight: sheetHeight },
			]}
			{...panResponder.panHandlers}
		>
			<KeyboardAvoidingView
				style={styles.flexContainer}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<View style={[styles.contentContainer, { paddingHorizontal: sheetPadding }]}>
					<ScrollView
						bounces={false}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>
						{typeof sheetContent === 'function'
							? sheetContent()
							: sheetContent}
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	flexContainer: {
		flex: 1,
	},
	bottomSheet: {
		backgroundColor: COLORS.white,
		position: 'absolute',
		width: SCREEN_WIDTH,
		bottom: 0,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.5,
	},
	contentContainer: {
		paddingVertical: 15,
	},
});
