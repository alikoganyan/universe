import React from 'react'
import { SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native'
export default function SafeAreaViewComponent(props) {
  const { children, style, behavior } = props;
  return (
    <SafeAreaView style={{ marginTop: Platform.OS === 'ios' ? 0 : 24, ...style }} >
      <KeyboardAvoidingView
        scrollEnabled={true}
        behavior={behavior || 'position'}
        style={{paddingBottom: Platform.OS === 'ios' ? 10 : 30}}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
