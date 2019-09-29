import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, StyleSheet } from 'react-native';
import { offlineImage } from '../assets/images';

class Offline extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.root}>
          <View />
          <View style={styles.imageCont}>
            <Image source={offlineImage} style={styles.image} />
          </View>
          <View style={styles.textCont}>
            <Text style={styles.text}>
              You’re offline.{'\n'}Check your connection.
          </Text>
          </View>
        </View>
        <SafeAreaView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d76ed',
  },
  root: {
    flex: 1,
    justifyContent: 'space-between'
  },
  imageCont: {
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain'
  },
  textCont: {
    paddingBottom: 20
  },
  text: {
    color: '#ffffff',
    fontSize: 25,
    textAlign: 'center'
  }
})

export default Offline;