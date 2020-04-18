import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import Emoji from "react-native-emoji";
import { reportStock as updateInventory, getPharmacy } from "../api";
import useLogin from "../hooks/useLogin";
import { STATUS_PALETTE, STATUS_EMOJIS } from "../styles/palette";
import { timeAgo } from "./utils";
export default function StockBar({ style }) {
  const { user } = useLogin();
  const [pharmacy, setPharmacy] = useState();

  useEffect(setPharmacyStatus, []);

  function setPharmacyStatus() {
    getPharmacy().then(setPharmacy);
  }

  function reportStock(updatedProduct) {
    const inventory = pharmacy.products.map((product) =>
      updatedProduct.id === product.id
        ? { ...product, stock: !product.stock }
        : product
    );

    updateInventory(inventory).then(setPharmacy);
  }

  function renderProducts() {
    return pharmacy.products.map((product, idx) => {
      return (
        <TouchableOpacity
          key={product.id}
          onPress={() => reportStock(product)}
          style={[
            styles.numberTab,
            {
              backgroundColor: product.stock
                ? STATUS_PALETTE[4]
                : STATUS_PALETTE[0],
            },
          ]}
        >
          <Text>{product.name}</Text>
        </TouchableOpacity>
      );
    });
  }

  function renderStats() {
    return (
      <View style={styles.stats}>
        <Text
          style={styles.lastUpdate}
        >{`Actualizaste el inventario ${timeAgo(
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
  numberTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
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
