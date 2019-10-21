import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

class Forwarded extends PureComponent {
  render() {
    const { userName, text, myMessage } = this.props
    return (
      <View
        style={[
          styles.root,
          { backgroundColor: myMessage ? '#cfe9ba' : '#ececec' },
        ]}
      >
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          {text}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    padding: 8,
    margin: 8,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#034402',
  },
  userName: {
    color: '#034402',
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    fontSize: 14,
  },
})

export default Forwarded
