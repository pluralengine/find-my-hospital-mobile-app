import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MapScreen, LoginScreen, SignupScreen } from "./components";
import { createStackNavigator } from "@react-navigation/stack";
import { getUser } from "./api.js";
import { KEYS } from "./storage";
import LoginContext from "./context/LoginContext";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({ email: "", name: "" });

  useEffect(() => {
    AsyncStorage.getItem(KEYS.USER).then((value) => {
      const user = value && JSON.parse(value);

      setUser(user);
    });
  }, []);

  return (
    <LoginContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={MapScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginContext.Provider>
  );
}
