import React, { Component } from 'react'
import { View, Text, Image, Platform, Dimensions } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import FloatingLabel from 'react-native-floating-labels'
import styled from 'styled-components'
import helper from '../../utils/helpers'

const { HeaderHeight } = helper
const Wrapper = styled(View)`
  height: ${Dimensions.get('window').height - HeaderHeight};
`
const Author = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border: 1px solid #c5c5c5;
  border-width: 0;
  padding: 10px;
  border-bottom-width: 1px;
`
const AuthorImage = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 20;
  background: red;
`
const Post = styled(View)`
  border: 1px solid red;
  position: absolute;
  width: 100%;
  bottom: 20;
`
const AutoGrowingInput = styled(AutoGrowingTextInput)`
  max-height: 250px;
`
const Input = props => {
  const {
    children,
    password = false,
    value,
    style,
    editable,
    multiline,
    onContentSizeChange,
  } = props
  return (
    <FloatingLabel
      labelStyle={{ fontSize: 11 }}
      inputStyle={{
        fontSize: 11,
        borderWidth: 0,
        borderBottomWidth: 1,
        display: 'flex',
      }}
      password={password}
      value={value}
      style={{ ...style }}
      multiline={multiline}
      editable={editable}
      onContentSizeChange={onContentSizeChange}
    >
      {children}
    </FloatingLabel>
  )
}
export default class Content extends Component {
  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid behavior="padding">
        <Wrapper>
          <Author>
            <AuthorImage />
            <Input style={{ flex: 1 }}>Укажите автора новости</Input>
          </Author>
          <Post>
            <AutoGrowingInput placeholder="введите ваше сообщение" />

            <Input style={{ flex: 1 }}>Укажите хештег</Input>
          </Post>
        </Wrapper>
      </KeyboardAwareScrollView>
    )
  }

  state = {
    height: 'auto',
  }

  componentDidMount() {}

  updateSize = height => {
    this.setState({
      height,
    })
  }
}
