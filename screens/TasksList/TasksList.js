import React, { Component } from 'react'
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native'
import styled from 'styled-components'
import Header from './Header'
import Content from './Content'
import SafeAreaView from '../../common/SafeAreaView'
import helper from '../../utils/helpers'
const { sidePadding } = helper;
const Wrapper = styled(View)`
  max-height: ${Dimensions.get('window').height - sidePadding}px;
`

export default class Tasks extends Component {
	render() {
		return (
			<SafeAreaView behavior={'padding'}>
				<Wrapper>
					<Header navigate={this.navigate} back={this.navigateBack} />
					<Content navigate={this.navigate} />
				</Wrapper>
			</SafeAreaView>
		)
	}
	navigateBack = () => {
		this.props.navigation.goBack()
	}
	navigate = (e) => {
		this.props.navigation.navigate(e)
	}
}
