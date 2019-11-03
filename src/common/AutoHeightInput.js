import React, { PureComponent } from 'react'
import { TextInput, StyleSheet } from 'react-native'

export default class AutoHeightInput extends PureComponent {
  state = {
    height: 0,
  }

  _onContentSizeChange = ({
    nativeEvent: {
      contentSize: { height },
    },
  }) => {
    this.setState({ height })
  }

  render() {
    const {
      autoHeight = false,
      multiline = false,
      style,
      ...props
    } = this.props
    const { height } = this.state

    const propsStyle = StyleSheet.flatten(style)
    const {
      height: propsHeight = 0,
      maxHeight = -1,
      paddingTop = 0,
      paddingBottom = 0,
      paddingVertical = 0,
    } = propsStyle
    let inputStyle = propsStyle
    const calcHeight = Math.max(
      height + (paddingVertical ? paddingVertical : paddingTop + paddingBottom),
      propsHeight,
    )

    if (autoHeight) {
      inputStyle = {
        ...inputStyle,
        height:
          maxHeight === -1
            ? Math.max(calcHeight, propsHeight)
            : maxHeight > calcHeight
            ? calcHeight
            : maxHeight,
      }
    }
    return (
      <TextInput
        {...props}
        style={inputStyle}
        multiline={multiline || autoHeight}
        onContentSizeChange={this._onContentSizeChange}
      />
    )
  }
}
