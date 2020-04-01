import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import data from "./assets/api/hospitals.json";

export default function App() {
  const [hospitals, setHospitals] = useState(data);

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {hospitals.map(hospital => (
          <Marker
            coordinate={{
              latitude: hospital.geometry.lat,
              longitude: hospital.geometry.lng
            }}
            title={hospital.name}
            description={hospital.address}
          />
        ))}
      </MapView>
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
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});