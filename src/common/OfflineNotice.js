import React, { PureComponent } from 'react'
import { View, Text, Dimensions, StyleSheet, Platform } from 'react-native'
import ScreenLoader from './ScreenLoader'

const { width } = Dimensions.get('window')
function MiniOfflineSign(props) {
  return (
    <View style={[styles.offlineContainer, { backgroundColor: props.bgColor }]}>
      <Text style={styles.offlineText}>{props.text}</Text>
      <ScreenLoader color="red" />
    </View>
  )
}
class OfflineNotice extends PureComponent {
  render() {
    return (
      <MiniOfflineSign text={this.props.text} bgColor={this.props.bgColor} />
    )
  }
}
const styles = StyleSheet.create({
  offlineContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 30 : 0,
    zIndex: 10,
  },
  offlineText: {
    color: '#fff',
  },
})
export default OfflineNotice
