import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import TrackOrdersScreen from '../screens/TrackOrdersScreen';
import AuthScreen from '../screens/AuthScreen';
import AboutBrandScreen from '../screens/AboutBrandScreen';
import LaunchScreen from '../screens/LaunchScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Launch"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {/* ── Launch Experience (first screen on cold start) */}
      <Stack.Screen
        name="Launch"
        component={LaunchScreen}
        options={{ gestureEnabled: false, animation: 'none' }}
      />

      {/* ── Main App */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ animation: 'fade' }}
      />

      {/* ── Stack Detail & Checkout Flows */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="TrackOrders"
        component={TrackOrdersScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="AboutBrand"
        component={AboutBrandScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
