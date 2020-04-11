import "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  AsyncStorage,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getHospitals } from "../api";
import LoginContext from "../context/LoginContext";
import { KEYS } from "../storage";

export default function MapScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const { user, setUser } = useContext(LoginContext);

  useEffect(() => {
    getHospitals().then(setHospitals);
  }, []);

  function logout() {
    AsyncStorage.removeItem(KEYS.USER).then(() => setUser({}));
  }

  function renderLogin() {
    return user && user.email ? (
      <TouchableOpacity style={styles.loginButton} onPress={logout}>
        <Text>Cerrar sesión</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text>¿Eres personal sanitario?</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            coordinate={{
              latitude: parseFloat(hospital.geometryLat),
              longitude: parseFloat(hospital.geometryLng),
            }}
            title={hospital.name}
            description={hospital.address}
          />
        ))}
      </MapView>
      {renderLogin()}
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
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
    right: 24,
    top: 24,
  },
});
