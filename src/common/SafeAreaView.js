import React from 'react'
import { SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SafeAreaViewComponent(props) {
  const { children, style, enabled = true } = props
  return (
    <SafeAreaView style={{ ...style, flex: 1 }}>
      {/* <KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
        enabled={enabled}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
