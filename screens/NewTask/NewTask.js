import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import styled from 'styled-components'
import { SafeAreaView } from '../../common'
import { Header, Content } from './index'
import helper from '../../utils/helpers'

const { HeaderHeight } = helper;
const Wrapper = styled(View)`
    height: 100%;
    padding-bottom: ${HeaderHeight};
`
export default class Signup extends Component {
    render() {
        return (
            <SafeAreaView behavior={'padding'}>
                <Wrapper>
                    <Header back={this.props.navigation.goBack}/>
                    <Content addParticipants={this.addParticipants} forward={this.moveForward} />
                </Wrapper>
            </SafeAreaView>
        )
    }
    componentDidMount() {

    }
    moveForward = () => {
        this.props.navigation.navigate('Tasks')
    }
    addParticipants = () => {
        this.props.navigation.navigate('NewTaskReceivers')
    }
}
