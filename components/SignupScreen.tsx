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
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>
        Pedir acceso como personal del hospital
      </Text>
      <Text style={styles.formSubtitle}>
        Por el momento, solo personal del hospital podrá informar del estado de
        ocupación de Urgencias. Para verificar que usted pertenece al mismo, por
        favor rellene sus datos y verificaremos su identidad.
      </Text>
      <TextInput
        style={styles.formInput}
        placeholder="Nombre y Apellidos"
        onChangeText={user => setUser(user)}
        defaultValue={user}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Email de acceso"
        onChangeText={email => setEmail(email)}
        defaultValue={email}
      />
      <TouchableOpacity style={styles.loginButton}>
        <Text>Pedir acceso</Text>
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
    paddingHorizontal: 48,
  },
  formTitle: {
    fontSize: 24,
    marginBottom: 24,
  },
  formSubtitle: {
    marginBottom: 16
  },
  formInput: {
    height: 48,
    width: "100%",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16
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
  },
  formLink: {
    textDecorationLine: "underline"
  }
});
