import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getHospitals } from "../api";
import useLogin from "../hooks/useLogin";
import VoteBar from "./VoteBar";
import { STATUS_PALETTE, STATUS_MARKER_PALETTE } from "../styles/palette";

export default function HospitalMapScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const { user, logout } = useLogin();
  const isLoggedIn = Boolean(user && user.email);
  const showVoteBar = isLoggedIn;

  useEffect(() => {
    getHospitals().then((hospitals) => setHospitals(hospitals));
  }, []);

  function renderLogin() {
    return isLoggedIn ? (
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
      <MapView
        style={[styles.map, { height: showVoteBar ? "80%" : "100%" }]}
        provider={"google"}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            tracksViewChanges={false}
            coordinate={{
              latitude: parseFloat(hospital.geometryLat),
              longitude: parseFloat(hospital.geometryLng),
            }}
            title={hospital.name}
            description={hospital.address}
            pinColor={getPinColor(hospital.status)}
          />
        ))}
      </MapView>
      {showVoteBar && <VoteBar style={styles.bottomBar} />}
      {renderLogin()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F5F5F5",
  },
  map: {
    width: "100%",
    height: "80%",
  },
  loginButton: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 5,
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
  bottomBar: {
    height: "20%",
    maxHeight: "20%",
    overflow: "hidden",
    width: "100%",
  },
});

function getPinColor(status) {
  if (!Number.isFinite(status)) {
    return "linen";
  }

  return STATUS_MARKER_PALETTE[Math.round(status / 20) - 1];
}
