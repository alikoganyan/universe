import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, StyleSheet } from 'react-native';
import { offlineImage } from '../assets/images';

class Offline extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        <View style={styles.root}>
          <View style={styles.imageCont}>
            <Image source={offlineImage} style={styles.image} />
          </View>
          <View style={styles.textCont}>
            <Text style={styles.text}>
              <Text style={styles.title}>You’re offline.</Text>
              {' '}Check your connection.
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3d76ed',
  },
  root: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageCont: {
    alignItems: 'center'
  },
  image: {
    height: 70,
    width: 70,
    resizeMode: 'contain'
  },
  text: {
    color: '#ffffff',
    fontSize: 13,
    textAlign: 'center'
  },
  title: {
    fontSize: 22
  }
})

export default Offline;