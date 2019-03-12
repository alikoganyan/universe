import React from 'react'
import { SafeAreaView, Platform } from 'react-native'
export default function SafeAreaViewComponent(props) {
  const { children, style } = props;
  return (
    <SafeAreaView style={{ marginTop: Platform.OS === 'ios' ? 0 : 24, ...style }} >
      {children}
    </SafeAreaView>
  )
}
