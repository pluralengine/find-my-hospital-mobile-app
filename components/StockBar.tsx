import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { updatePharmacyStock, getPharmacy, getProducts } from "../api";
import useLogin from "../hooks/useLogin";
import { STATUS_PALETTE } from "../styles/palette";
import { ICONS } from "../styles/icons";
import { timeAgo } from "./utils";
export default function StockBar({ style }) {
  const { user } = useLogin();
  const [pharmacy, setPharmacy] = useState();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getPharmacy(user.token).then((data) => {
      setPharmacy(data);
    });
    getProducts().then(setProducts);
  }, []);

  function reportStock(product) {
    const hasStock = pharmacy.products.some((p) => p.id === product.id);

    updatePharmacyStock(product, !hasStock).then(setPharmacy);
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
        <Text style={styles.lastUpdate}>{`Actualizaste el inventario ${timeAgo(
          new Date(pharmacy.updatedAt)
        )}`}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {pharmacy && renderStats()}
      <View style={styles.itemsContainer}>{pharmacy && renderProducts()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  itemsContainer: {
    display: "flex",
    flexDirection: "row",
    height: "50%",
    justifyContent: "space-between",
    padding: 16,
    flexWrap: "wrap",
  },
  productButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
    padding: 8,
  },
  productButtonText: {
    color: "white",
  },
  productButtonImg: {
    width: 48,
    height: 48,
  },
  tabText: {
    fontSize: 24,
  },
  tabSlider: {
    padding: 8,
  },
  stats: {
    display: "flex",
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  lastUpdate: {
    flex: 1,
    paddingHorizontal: 16,
    width: "50%",
    textAlign: "right",
    color: "gray",
    fontSize: 12,
  },
  capacity: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    flex: 1,
    textTransform: "uppercase",
    width: "50%",
    textAlign: "center",
    fontSize: 40,
  },
  capacityValue: {
    fontSize: 40,
    marginRight: 8,
  },
  capacityLabel: {
    fontSize: 12,
  },
});
