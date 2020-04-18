import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Picker } from "react-native";
import MapView, { Marker } from "react-native-maps";
import SearchableDropdown from "react-native-searchable-dropdown";
import { getPharmacies, getProvinces } from "../api";
import useLogin from "../hooks/useLogin";
import StockBar from "./StockBar";

export default function MapScreen({ navigation }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [_, setSelectedProvinces] = useState("java");
  const { user, logout } = useLogin();
  const isLoggedIn = Boolean(user && user.email);
  const showVoteBar = true;

  useEffect(() => {
    getPharmacies().then(setPharmacies);
    getProvinces().then(setParsedProvinces);
  }, []);

  function setParsedProvinces(provinces) {
    const selectFormat = provinces.map((province) => ({
      id: province,
      name: province,
    }));

    setProvinces(selectFormat);
  }

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
        <Text>Entrar</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={[styles.map, { height: showVoteBar ? "80%" : "100%" }]}
        provider={"google"}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {pharmacies.map((pharmacy) => {
          return (
            <Marker
              key={pharmacy.id}
              tracksViewChanges={false}
              coordinate={{
                latitude: parseFloat(pharmacy.geometryLat),
                longitude: parseFloat(pharmacy.geometryLng),
              }}
              title={pharmacy.name}
              description={pharmacy.address}
              pinColor={getPinColor(pharmacy)}
            />
          );
        })}
      </MapView>
      {showVoteBar && <StockBar style={styles.bottomBar} />}
      {renderLogin()}
      <SearchableDropdown
        select
        onItemSelect={setSelectedProvinces}
        containerStyle={styles.provincesSelector}
        itemStyle={styles.dropdownItem}
        itemsContainerStyle={styles.itemsContainer}
        items={provinces}
        textInputProps={{
          placeholder: "Selecciona tu provincia",
          style: styles.formInput,
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
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
  provincesSelector: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#F5F5F5",
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    left: 24,
    top: 24,
    width: "45%",
    maxHeight: 400,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  itemsContainer: {
    maxHeight: 140,
    borderRadius: 10,
  },
  formInput: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottomBar: {
    height: "20%",
    maxHeight: "20%",
    overflow: "hidden",
    width: "100%",
  },
});

function getPinColor(pharmacy) {
  const [mask, gel] = pharmacy.products;
  if (!mask.stock && !gel.stock) {
    return "red";
  }
  if ((!mask.stock && gel.stock) || (mask.stock && !gel.stock)) {
    return "cyan";
  }
  if (mask.stock && gel.stock) {
    return "green";
  }

  return "linen";
}
