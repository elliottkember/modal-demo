import {
  NavigationContainer,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} testID="app">
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
    </GestureHandlerRootView>
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
  <Stack2.Navigator initialRouteName="Modal">
    <Stack2.Screen name="Modal" component={ModalView} />
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
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
    onPanResponderRelease: () => {
      pan.extractOffset();
    },
  });
  const gestures2 = PanResponder.create({
    onShouldBlockNativeResponder: () => true,
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan2.x, dy: pan2.y }]),
    onPanResponderRelease: () => {
      pan.extractOffset();
    },
  });
  return (
    <View style={{ flexGrow: 1 }}>
      <View
        style={{
          width: '100%',
          height: '50%',
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
      <View
        style={{
          width: '100%',
          height: '50%',
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
    </View>
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
