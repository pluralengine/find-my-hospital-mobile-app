import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { AsyncStorage, View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { MapScreen, LoginScreen, SignupScreen } from "./components";
import { createStackNavigator } from "@react-navigation/stack";
import { KEYS } from "./storage";
import LoginContext from "./context/LoginContext";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({ email: "", name: "", hospitalId: 0 });

  useEffect(() => {
    AsyncStorage.getItem(KEYS.USER).then((value) => {
      const user = value && JSON.parse(value);

      setUser(user);
    });
  }, []);

  function logout() {
    AsyncStorage.removeItem(KEYS.USER).then(() =>
      setUser({ email: "", name: "", hospitalId: 0 })
    );
  }
  const theme = {
    ...DefaultTheme,
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: '#F5F5F5',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'transparent',
    },
  };
  return (
    <LoginContext.Provider value={{ user, setUser, logout }}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen name="Inicio" component={MapScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginContext.Provider>
  );
}
