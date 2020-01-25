import React, { PureComponent } from 'react'
import { View, Dimensions, TextInput } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { CloseIcon, SearchIconGray } from '../../assets/index'
import helper from '../../utils/helpers'
import { p_news_search } from '../../constants/api'
import { setNews } from '../../actions/newsActions'
import sendRequest from '../../utils/request'

const { sidePadding, fontSize, HeaderHeight } = helper

const Wrapper = styled(View)`
  border-bottom-color: #e8ebee;
  border-bottom-width: 1px;
  padding-bottom: 12px;
  margin-bottom: 13px;
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

class HeaderComponent extends PureComponent {
  render() {
    const { focused, input } = this.state
    return (
      <Wrapper>
        <Header>
          <SearchIconGray />
          <Input
            value={input}
            onChangeText={this.handleInputChange}
            onFocus={this.handleFocus}
            placeholder="Поиск"
            editable={false}
          />
          {focused && (
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
    focused: false,
    input: '',
  }

  handleInputChange = e => {
    const { setNews } = this.props
    this.setState({ input: e })
    e
      ? sendRequest({
          r_path: p_news_search,
          method: 'post',
          attr: {
            text: e,
            withUser: true,
          },
          success: res => {
            setNews(res.news)
          },
          failFunc: err => {},
        })
      : sendRequest({
          r_path: p_news_search,
          method: 'post',
          attr: {
            text: '',
            withUser: true,
          },
          success: res => {
            setNews(res.news)
          },
          failFunc: err => {},
        })
  }

  addTask = e => {
    const { navigate } = this.props
    navigate('NewFeed')
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  onBlur = () => {
    this.setState({ focused: false, input: '' })
  }
}

const mapDispatchToProps = dispatch => ({
  setNews: _ => dispatch(setNews(_)),
})
export default connect(null, mapDispatchToProps)(HeaderComponent)
