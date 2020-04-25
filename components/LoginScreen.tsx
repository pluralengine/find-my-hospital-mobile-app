import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  AsyncStorage,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { login as loginUser } from "../api";
import { KEYS } from "../storage";
import useLogin from "../hooks/useLogin";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useLogin();

  function login() {
    loginUser(email, password)
      .then((user) =>
        AsyncStorage.setItem(KEYS.USER, JSON.stringify(user)).then(() => user)
      )
      .then((user) => {
        if (user && user.token) {
          Alert.alert(
            `Hola de nuevo, ${user.name}`,
            ` Nunca podremos agradecer suficiente lo que estás haciendo durante esta crisis por nosotros. \n\n ¡Venceremos al virus!`
          );
          setUser(user);
          navigation.navigate("Inicio");
        } else {
          throw new Error(
            `The token is missing in the user information ${JSON.stringify(
              user
            )}`
          );
        }
      })
      .catch((e) => {
        console.warn(e);
        Alert.alert(
          `Fallo al iniciar sesión`,
          `Los credenciales son erróneos o el usuario está pendiente de validación`
        );
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Acceso a personal de farmacia</Text>
      <TextInput
        style={styles.formInput}
        placeholder="Email"
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={(email) => setEmail(email)}
        defaultValue={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.formInput}
        placeholder="Contraseña"
        autoCompleteType="password"
        textContentType="password"
        secureTextEntry
        onChangeText={(password) => setPassword(password)}
        defaultValue={password}
        autoCapitalize="none"
      />
      <Text
        style={styles.formLink}
        onPress={() => navigation.navigate("Registro")}
      >
        Tengo una farmacia y no tengo cuenta, ¿Cómo me registro?
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={login}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 48,
  },
  formTitle: {
    fontSize: 24,
    marginBottom: 32,
  },
  formInput: {
    width: "100%",
    height: 48,
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  formLink: {
    textDecorationLine: "underline",
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#F5F5F5",
    borderWidth: 1,
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
