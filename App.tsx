import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import logo from "./assets/icon.png";
export default function App() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text>Buscando el hospital mas cercano...</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Hello world!")}
      >
        <Text style={styles.buttonText}>Salute!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: { width: 100, height: 100, margin: 50 },
  button: {
    margin: 10,
    backgroundColor: "lightgrey",
    padding: 10,
    borderWidth: 0,
    borderRadius: 5
  },
  buttonText: { color: "white" }
});
