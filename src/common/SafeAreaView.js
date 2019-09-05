import React from 'react'
import { SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SafeAreaViewComponent(props) {
  const { children, style, behavior } = props
  return (
    <SafeAreaView style={{ ...style }}>
      {/* <KeyboardAvoidingView */}
      <KeyboardAvoidingView
        scrollEnabled
        behavior={behavior || 'position'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -243}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
