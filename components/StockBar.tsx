import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { updatePharmacyStock, getPharmacy, getProducts } from "../api";
import useLogin from "../hooks/useLogin";
import { STATUS_PALETTE } from "../styles/palette";
import { ICONS } from "../styles/icons";
import { timeAgo, showAlert } from "./utils";
import { palette } from "../styles/theme";

export default function StockBar({ style }) {
  const { user } = useLogin();
  const [pharmacy, setPharmacy] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getPharmacy(user.token).then((data) => {
      setPharmacy(data);
    });
    getProducts().then(setProducts);
  }, []);

  function reportStock(product) {
    const hasStock = pharmacy.products.some((p) => p.id === product.id);

    updatePharmacyStock(user.token, product.id, !hasStock)
      .then(setPharmacy)
      .catch((e) => showAlert("Error actualizando el stock", String(e)));
  }

  function renderProducts() {
    return products.map((product, idx) => {
      const hasStock = pharmacy.products.some((p) => p.id === product.id);
      return (
        <TouchableOpacity
          key={product.id}
          onPress={() => reportStock(product)}
          style={[
            styles.productButton,
            {
              backgroundColor: hasStock ? STATUS_PALETTE[4] : STATUS_PALETTE[0],
            },
          ]}
        >
          {ICONS[product.photo] ? (
            <Image
              style={styles.productButtonImg}
              source={ICONS[product.photo]}
              accessibilityLabel={product.name}
            />
          ) : (
            <Text style={styles.productButtonText}>{product.name}</Text>
          )}
        </TouchableOpacity>
      );
    });
  }

  function renderStats() {
    return (
      <View style={styles.stats}>
        <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
        <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
        <Text style={styles.statsText}>{`Actualizaste el inventario ${timeAgo(
          new Date(pharmacy.updatedAt)
        )}`}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.panelTitle}>Mi farmacia</Text>
      <View style={styles.itemsContainer}>{pharmacy && renderProducts()}</View>
      {pharmacy && renderStats()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  panelTitle: {
    fontSize: 14,
    alignSelf: "center",
    textTransform: "uppercase",
    marginBottom: 8,
    fontWeight: "bold",
  },
  itemsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  productButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 4,
    padding: 8,
    flexDirection: "row",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  productButtonText: {
    color: "white",
  },
  productButtonImg: {
    width: 42,
    height: 42,
  },
  tabText: {
    fontSize: 24,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  tabSlider: {
    padding: 8,
  },
  stats: {
    display: "flex",
    width: "100%",
    padding: 8,
    paddingRight: 16,
  },
  pharmacyName: {
    textAlign: "right",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: palette.neutralPrimary,
    fontSize: 12,
  },
  pharmacyAddress: {
    textAlign: "right",
    textTransform: "capitalize",
    color: palette.neutralDark,
    fontSize: 12,
    marginBottom: 8,
  },
  statsText: {
    textAlign: "right",
    color: "gray",
    fontSize: 10,
    flexWrap: "nowrap"
  },
});
