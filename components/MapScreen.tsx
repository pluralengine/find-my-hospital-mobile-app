import "react-native-gesture-handler";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import SearchableDropdown from "react-native-searchable-dropdown";
import { getPharmacies, getProvinces, getProducts } from "../api";
import useLogin from "../hooks/useLogin";
import StockBar from "./StockBar";
import { ICONS } from "../styles/icons";
import { STATUS_PALETTE } from "../styles/palette";
import { Linking } from "expo";
import { palette } from "../styles/theme";

const DEFAULT_LATITUDE_DELTA = 0.026006060443698686;
const DEFAULT_LONGITUDE_DELTA = 0.017766952514648438;
const WIDTH = Math.round(Dimensions.get("window").width);
const CALLOUT_MAXWIDTH = 0.5 * WIDTH;

export default function MapScreen({ navigation }) {
  const [provinceItems, setProvinceItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [city, setCity] = useState();
  const [location, setLocation] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentMarker, setCurrentMarker] = useState();
  const { user, logout } = useLogin();
  const mapRef = useRef(null);
  const isLoggedIn = Boolean(user && user.email);
  const showStatusBar = isLoggedIn;

  async function moveToLocation() {
    setLoading(true);
    const { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission to access location was denied");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    setLocation(location.coords);
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitude: location.coords.longitude,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    });
    setLoading(false);
  }

  const handleGMapsLink = (url) => {
    setLoading(true);
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url).then(() => setLoading(false));
      }
    });
  };

  function generateGMapsURL(pharmacy) {
    return encodeURI(
      `https://www.google.com/maps/search/?api=1&query=${pharmacy.address},${pharmacy.areas}`
    );
  }

  useEffect(() => {
    setLoading(true);
    getProvinces()
      .then((data) => {
        const items = data.map((city) => ({
          value: city,
          name: city,
        }));
        setProvinceItems(items);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (city) {
      setLoading(true);
      getPharmacies({ areas: city })
        .then((data) => {
          setPharmacies(data);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    }
  }, [city]);

  useEffect(() => {
    setLoading(true);
    getProducts().then((products) => {
      setProducts(products);
      setCurrentProduct(products[0]);
      setLoading(false);
    });
  }, []);

  function handleProductsButtonClick() {
    const index = products.findIndex((product) => {
      return product.id === currentProduct.id;
    });
    if (index === products.length - 1) {
      setCurrentProduct(products[0]);
    } else {
      setCurrentProduct(products[index + 1]);
    }
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

  function pinColor(pharmacy) {
    const hasStock = pharmacy.products.some((product) => {
      return product.id === currentProduct.id;
    });
    return hasStock ? "green" : "red";
  }

  function isProductAvailable(pharmacy, item) {
    const productIds = pharmacy.products.map((product) => product.id);
    return productIds && productIds.some((id) => id === item.id);
  }

  const isCalloutVisible = (pharmacy) =>
    Platform.OS !== "web" || currentMarker === pharmacy.id;
  const displayCurrentLocationButton = Platform.OS === "web";

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={[styles.map, { height: "100%" }]}
        provider={"google"}
        showsUserLocation
        onMapReady={moveToLocation}
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
              pinColor={pinColor(pharmacy)}
              onPress={() => setCurrentMarker(pharmacy.id)}
            >
              {isCalloutVisible(pharmacy) && (
                <Callout
                  onPress={() => handleGMapsLink(generateGMapsURL(pharmacy))}
                >
                  <View style={styles.callout}>
                    <View style={styles.imageArea}>
                      {products.map((product) => {
                        return (
                          <View
                            key={product.id}
                            style={[
                              styles.logoArea,
                              {
                                backgroundColor: isProductAvailable(
                                  pharmacy,
                                  product
                                )
                                  ? STATUS_PALETTE[4]
                                  : STATUS_PALETTE[0],
                              },
                            ]}
                          >
                            <Image
                              key={product.id}
                              source={ICONS[product.photo]}
                              style={styles.productsImageCallout}
                            />
                          </View>
                        );
                      })}
                    </View>
                    <View style={styles.textAreaStyle}>
                      <Text
                        style={{
                          textTransform: "capitalize",
                        }}
                      >{`Farmacia ${pharmacy.name}`}</Text>
                      <Text style={{ color: "blue" }}>Cómo llegar</Text>
                    </View>
                  </View>
                </Callout>
              )}
            </Marker>
          );
        })}
      </MapView>
      <SearchableDropdown
        select
        inputHeight={36}
        onItemSelect={(item) => setCity(item.value)}
        containerStyle={styles.provincesSelector}
        itemStyle={styles.dropdownItem}
        itemsContainerStyle={styles.itemsContainer}
        items={provinceItems}
        textInputProps={{
          placeholder: "Selecciona tu ciudad",
          style: styles.formInput,
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      {renderLogin()}
      {showStatusBar && <StockBar style={styles.bottomBar} />}
      <TouchableOpacity
        style={[styles.compassButton, { bottom: showStatusBar ? 220 : 24 }]}
        onPress={moveToLocation}
      >
        <Image source={ICONS.compass} style={styles.compassButtonImage} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.productsButton, { bottom: showStatusBar ? 288 : 92 }]}
        onPress={handleProductsButtonClick}
      >
        {currentProduct && (
          <Image
            source={ICONS[currentProduct.photo]}
            style={styles.productsButtonImage}
          />
        )}
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loginButton: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 5,
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    right: 24,
    top: 24,
    height: 36,
  },
  provincesSelector: {
    position: "absolute",
    left: 22,
    top: 24,
    width: 200,
    maxWidth: 250,
    maxHeight: 400,
    backgroundColor: "white",
    borderRadius: 5,
    alignContent: "center",
    justifyContent: "center",
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
    borderRadius: 5,
  },
  formInput: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottomBar: {
    position: "absolute",
    right: 16,
    bottom: 16,
    maxWidth: "95%",
    minWidth: 288,
    borderRadius: 10,
    shadowColor: palette.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 4,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    opacity: 0.5,
  },
  callout: {
    padding: 4,
    display: "flex",
    justifyContent: "center",
    maxWidth: CALLOUT_MAXWIDTH,
  },
  imageArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 4,
  },
  logoArea: {
    borderRadius: 50,
    padding: 4,
    marginRight: 4,
  },
  textAreaStyle: {
    padding: 4,
    marginBottom: 6,
  },
  productsImageCallout: {
    width: 32,
    height: 32,
  },
  productsButton: {
    position: "absolute",
    right: 12,
    backgroundColor: palette.themePrimary,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 50,
    padding: 8,
    shadowColor: palette.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  productsButtonImage: {
    width: 42,
    height: 42,
  },
  compassButton: {
    display: "flex",
    backgroundColor: palette.white,
    borderRadius: 50,
    padding: 16,
    position: "absolute",
    right: 12,
    shadowColor: palette.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  compassButtonImage: { height: 26, width: 26 },
});
