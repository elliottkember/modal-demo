import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import 'react-native-gesture-handler';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

import {
  NavigationContainer,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Button,
} from 'react-native';
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }} testID="app">
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <View style={{ width: '100%', height: '100%' }}>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen
                    name="Modal"
                    component={ModalStack}
                    options={{
                      presentation: 'modal',
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const HomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.dispatch(StackActions.push('Modal'));
  });

  return (
    <View style={{}}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(StackActions.push('Modal'))}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 10,
          padding: 40,
        }}
      >
        <Text style={{ fontSize: 24 }}>Open modal</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack2 = createNativeStackNavigator();

const ModalStack = () => (
  <Stack2.Navigator initialRouteName="innermodal">
    <Stack2.Screen
      name="innermodal"
      component={ModalView}
      options={{
        headerShown: false,
        presentation: 'formSheet',
      }}
    />
  </Stack2.Navigator>
);

const ModalView = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const pan2 = useRef(new Animated.ValueXY()).current;

  const gestures = PanResponder.create({
    onShouldBlockNativeResponder: () => false,
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => false,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: true,
        l,
      })(evt, gestureState);
    },
  });

  const gestures2 = PanResponder.create({
    onShouldBlockNativeResponder: () => true,
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, { dx: pan2.x, dy: pan2.y }], {
        useNativeDriver: true,
        l,
      })(evt, gestureState);
    },
  });

  const bottomSheetModalRef = useRef(null);

  return (
    <BottomSheetModalProvider>
      <Button
        title="Show bottom-sheet (fixes panning)"
        onPress={() => {
          bottomSheetModalRef.current?.present();
        }}
      />
      <ReactNativeZoomableView
        style={{ height: '33%' }}
        maxZoom={100}
        minZoom={1}
        onShouldBlockNativeResponder={() => {
          return true;
        }}
        initialZoom={1}
        zoomStep={1}
        contentWidth={800}
        contentHeight={800}
        panBoundaryPadding={50}
        bindToBorders
        movementSensibility={1}
        pinchToZoomInSensitivity={1}
        pinchToZoomOutSensitivity={1}
        disableMomentum
      >
        <View style={{ backgroundColor: 'purple' }}>
          <Text>hi</Text>
        </View>
      </ReactNativeZoomableView>
      <View
        style={{
          width: '100%',
          height: '33%',
          backgroundColor: '#99ff99',
        }}
        {...gestures2.panHandlers}
      >
        <Animated.View
          style={{
            backgroundColor: 'green',
            padding: 24,
            transform: [{ translateX: pan2.x }, { translateY: pan2.y }],
            position: 'absolute',
          }}
        >
          <Text>
            I can be moved around (onShouldBlockNativeResponder: true)
          </Text>
        </Animated.View>
      </View>
      <View
        style={{
          width: '100%',
          height: '33%',
          backgroundColor: '#ff9999',
        }}
        {...gestures.panHandlers}
      >
        <Animated.View
          style={{
            backgroundColor: 'red',
            padding: 24,
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            position: 'absolute',
          }}
        >
          <Text>
            I can't be moved around (onShouldBlockNativeResponder: false)
          </Text>
        </Animated.View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        stackBehavior="push"
        keyboardBlurBehavior="restore"
        snapPoints={['50%', '95%']}
      >
        <Text>hi</Text>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
