import React, { Component } from 'react'
import { View, Dimensions, TextInput } from 'react-native'
import styled from 'styled-components'
import { SearchIconGray, CloseIcon } from '../../assets/index'
import helper from '../../utils/helpers'

const { sidePadding, fontSize, HeaderHeight } = helper

const Wrapper = styled(View)`
  border-bottom-color: #e8ebee;
  border-bottom-width: 1px;
  padding-bottom: 12px;
`
const Header = styled(View)`
  width: ${Dimensions.get('window').width - sidePadding * 2}px;
  background-color: #f4f4f4;
  border-radius: 10px;
  font-size: ${fontSize.header};
  height: 37px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  z-index: 1;
  left: ${sidePadding}px;
  margin-top: 3px;
`
const Input = styled(TextInput)`
  flex: 1;
  height: ${HeaderHeight};
  position: relative;
  left: -4px;
  font-size: ${fontSize.input};
`

class HeaderComponent extends Component {
  render() {
    const { input } = this.state
    return (
      <Wrapper>
        <Header valueChange={this.props.changeOption}>
          <SearchIconGray />
          <Input
            value={input}
            onChangeText={this.handleInputChange}
            onFocus={this.handleFocus}
            placeholder="Поиск"
          />
          {!!input && (
            <CloseIcon
              onPress={this.onBlur}
              marginLeft={false}
              marginRight
              right
            />
          )}
        </Header>
      </Wrapper>
    )
  }

  state = {
    input: '',
  }

  handleInputChange = e => {
    this.props.onValueChange(e)
    this.setState({ input: e })
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  onBlur = () => {
    this.handleInputChange('')
    this.setState({ input: '' })
  }
}

export default HeaderComponent
