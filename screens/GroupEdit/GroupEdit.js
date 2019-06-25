import React, { Component } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import SafeAreaView from '../../common/SafeAreaView';
import Header from './Header';
import Content from './Content';

const Wrapper = styled(View)`
	height: 100%;
`;
export default class Signup extends Component {
  render() {
	const { navigation } = this.props;
	const defaultValues = navigation.getParam('currentDialog');
	return (
		<SafeAreaView behavior="padding">
			<Wrapper>
				<Header back={this.back} />
				<Content
					addParticipant={this.addParticipant}
					forward={this.moveForward}
					defaultValues={defaultValues}
				/>
			</Wrapper>
		</SafeAreaView>
	);
  }

  componentDidMount() {

  }

	moveForward = () => {
		const { navigation } = this.props;
		navigation.navigate('Dialogs');
	}

	back = () => {
		const { navigation } = this.props;
		navigation.goBack();
	}

	addParticipant = () => {
		const { navigation } = this.props;
		navigation.navigate('NewGroupParticipants');
	}
}
