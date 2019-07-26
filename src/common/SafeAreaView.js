import React from 'react'
import { SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SafeAreaViewComponent(props) {
  const { children, style, behavior } = props
  return (
    <SafeAreaView
      style={{ marginTop: Platform.OS === 'ios' ? 0 : 24, ...style }}
    >
      {/* <KeyboardAvoidingView */}
      <KeyboardAvoidingView
        scrollEnabled
        behavior={behavior || 'position'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
