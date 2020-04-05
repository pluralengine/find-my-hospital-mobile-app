import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput
} from "react-native";
import data from "../assets/api/hospitals.json";

export default function MapScreen({ navigation }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Acceso a personal del hospital</Text>
      <TextInput
        style={styles.formInput}
        placeholder="Usuario"
        onChangeText={user => setUser(user)}
        defaultValue={user}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Contraseña"
        onChangeText={password => setPassword(password)}
        defaultValue={password}
      />
      <Text
        style={styles.formLink}
        onPress={() => navigation.navigate("Registro")}
      >
        Soy personal de hospital y no tengo cuenta, ¿Como me registro?
      </Text>
      <TouchableOpacity style={styles.loginButton}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 48
  },
  formTitle: {
    fontSize: 24,
    marginBottom: 32
  },
  formInput: {
    width: "100%",
    height: 48,
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16
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
    paddingHorizontal: 16
  }

});
