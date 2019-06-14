import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import styled from 'styled-components'
import SafeAreaView from '../../common/SafeAreaView'
import Header from './Header'
import Content from './Content'
import helper from '../../utils/helpers'

const { HeaderHeight } = helper;
const Wrapper = styled(View)`
    height: 100%;
    padding-bottom: ${HeaderHeight};
`
export default class Signup extends Component {
    render() {
        const deafultValues = this.props.navigation.getParam('task', {});
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Header back={this.props.navigation.goBack} />
                    <Content addParticipants={this.addParticipants} forward={this.moveForward} deafultValues={deafultValues} />
                </Wrapper>
            </SafeAreaView>
        )
    }
    componentDidMount() {
    }
    moveForward = () => {
        this.props.navigation.navigate('TasksList')
    }
    addParticipants = () => {
        this.props.navigation.navigate('NewTaskReceivers')
    }
}
