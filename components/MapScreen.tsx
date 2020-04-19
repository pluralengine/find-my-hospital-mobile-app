import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Picker } from "react-native";
import MapView, { Marker } from "react-native-maps";
import SearchableDropdown from "react-native-searchable-dropdown";
import { getPharmacies, getProvinces } from "../api";
import useLogin from "../hooks/useLogin";
import StockBar from "./StockBar";

export default function MapScreen({ navigation }) {
  const [provinceItems, setProvinceItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [province, setProvince] = useState();
  const { user, logout } = useLogin();
  const isLoggedIn = Boolean(user && user.email);
  const showStatusBar = isLoggedIn;

  useEffect(() => {
    setLoading(true);
    getProvinces()
      .then((data) => {
        const items = data.map((province) => ({
          value: province,
          name: province,
        }));
        setProvinceItems(items);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (province) {
      console.log(province);
      setLoading(true);
      getPharmacies(province)
        .then((data) => {
          setPharmacies(data);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    }
  }, [province]);

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
        style={[styles.map, { height: showStatusBar ? "80%" : "100%" }]}
        provider={"google"}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {pharmacies.map((pharmacy) => {
          return (
            <Marker
              key={pharmacy.id}
              coordinate={{
                latitude: parseFloat(pharmacy.geometryLat),
                longitude: parseFloat(pharmacy.geometryLng),
              }}
              title={pharmacy.name}
              description={pharmacy.address}
            />
          );
        })}
      </MapView>
      {showStatusBar && <StockBar style={styles.bottomBar} />}
      {renderLogin()}
      <SearchableDropdown
        select
        onItemSelect={(item) => setProvince(item.value)}
        containerStyle={styles.provincesSelector}
        itemStyle={styles.dropdownItem}
        itemsContainerStyle={styles.itemsContainer}
        items={provinceItems}
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
