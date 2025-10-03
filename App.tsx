import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
 

import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";

export type RootStackParamList = {
  
  Login: undefined;
  RegistroPropietario:undefined;
  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    // Esconder la barra después de 2 segundos (2000 ms)
    const timeout = setTimeout(() => {
      NavigationBar.setVisibilityAsync("hidden");
    }, 200);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar/>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="inRegistroPropietarioicio"
        >
           
          <Stack.Screen
            name="RegistroPropietario"
            component={RegistroPropietario}
          /> 
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}