import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { BackIcon, EllipsisVIcon } from '../../assets/index'
import styled from 'styled-components'
import { SafeAreaView } from '../../Common'
import { connect } from 'react-redux';
import { Header, Content, Input } from '.'
const Wrapper = styled(View)`
    height: 100%;
`
const Bottom = styled(View)`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: white;
    
`

class Chat extends Component {
    render() {
        return (
            <SafeAreaView behavior={Platform.os === 'ios' ? 'height' : 'padding'}>
                <Wrapper>
                    <Header back={this.navigateBack} />
                    <Content />
                    <Bottom>
                        <Input />
                    </Bottom>
                </Wrapper>
            </SafeAreaView>
        )
    }
    navigateBack = () => {
        this.props.navigation.goBack()
    }
    navigateToUser = () => {
        this.props.navigation.goBack()
    }
}
const mapStateToProps = state => {
    return {
        search: state.messageReducer.search
    };
};
const mapDispatchToProps = dispatch => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(Chat)