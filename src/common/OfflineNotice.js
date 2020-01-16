import React, { PureComponent } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import ScreenLoader from './ScreenLoader'

const { width } = Dimensions.get('window')
function MiniOfflineSign(props) {
  return (
    <View
      style={[
        styles.offlineContainer,
        { backgroundColor: props.bgColor, top: props.conntecionError ? 44 : 0 },
      ]}
    >
      <Text style={styles.offlineText}>{props.text}</Text>
      <ScreenLoader color="red" />
    </View>
  )
}
class OfflineNotice extends PureComponent {
  render() {
    return (
      <MiniOfflineSign
        text={this.props.text}
        conntecionError={this.props.conntecionError}
        bgColor={this.props.bgColor}
      />
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
    top: 0,
    zIndex: 10,
  },
  offlineText: {
    color: '#fff',
  },
})
export default OfflineNotice
