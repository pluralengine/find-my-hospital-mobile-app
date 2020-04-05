import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import data from "../assets/api/hospitals.json";

export default function MapScreen({ navigation }) {
  const [hospitals, setHospitals] = useState(data);

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {hospitals.map(hospital => (
          <Marker
            key={hospital.id}
            coordinate={{
              latitude: hospital.geometry.lat,
              longitude: hospital.geometry.lng
            }}
            title={hospital.name}
            description={hospital.address}
          />
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
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
    backgroundColor: "#F5F5F5"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  loginButton: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#F5F5F5",
    borderWidth: 1,
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    right: 30,
    top: 50
  }
});
