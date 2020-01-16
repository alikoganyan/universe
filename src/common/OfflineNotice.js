import React, { PureComponent } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
const { width } = Dimensions.get('window')
function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  )
}
class OfflineNotice extends PureComponent {
  render() {
    return <MiniOfflineSign />
  }
}
const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,

    zIndex: 10,
  },
  offlineText: {
    color: '#fff',
  },
})
export default OfflineNotice
