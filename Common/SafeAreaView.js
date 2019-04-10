import React from './node_modules/react'
import { SafeAreaView, Platform, KeyboardAvoidingView } from './node_modules/react-native'
import { KeyboardAwareScrollView } from './node_modules/react-native-keyboard-aware-scroll-view'

export default function SafeAreaViewComponent(props) {
  const { children, style, behavior } = props;
  return (
    <SafeAreaView style={{ marginTop: Platform.OS === 'ios' ? 0 : 24, ...style }} >
      {/* <KeyboardAvoidingView */}
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
