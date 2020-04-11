import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Emoji from 'react-native-emoji';

export default function VoteBar({ style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.itemsConstainer}>
        <TouchableOpacity
          style={[styles.numberTab, { backgroundColor: '#cc3232' }]}
        >
          <Emoji style={styles.tabText} name='weary' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numberTab, { backgroundColor: '#db7b2b' }]}
        >
          <Emoji style={styles.tabText} name='slightly_frowning_face' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numberTab, { backgroundColor: '#e7b416' }]}
        >
          <Emoji style={styles.tabText} name='neutral_face' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numberTab, { backgroundColor: '#99c140' }]}
        >
          <Emoji style={styles.tabText} name='slightly_smiling_face' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numberTab, { backgroundColor: '#2dc937' }]}
        >
          <Emoji style={styles.tabText} name='grin' />
        </TouchableOpacity>
      </View>
      <View style={styles.stats}>
        <Text style={styles.hospitalName}>Nombre del Ho pasdfghjklzx cvbn</Text>
        <Text style={styles.capacity}>100%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemsConstainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '50%',
    justifyContent: 'space-around',
    padding: 16,
  },
  numberTab: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  tabText: {
    fontSize: 24,
  },
  tabSlider: {
    padding: 8,
  },
  stats: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
  hospitalName: {
    flex: 1,
    textTransform: 'uppercase',
    width: '50%',
    textAlign: 'center',
    fontSize: 18,
  },
  capacity: {
    flex: 1,
    textTransform: 'uppercase',
    width: '50%',
    textAlign: 'center',
    fontSize: 40,
  },
});
