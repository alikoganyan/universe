import React, { Component } from 'react'
import { Text, View, Image, Dimensions } from 'react-native'
import styled from 'styled-components'
import Img from '../../assets/960px.png'
console.log(Dimensions.get('window').height)
const Wrapper = styled(View)`
    height: 100%;
    width: 100%;
`
const BgImage = styled(Image)`
    height: 100%;
    width: 100%;
`
export default function SplashScreen() {
    return (
        <Wrapper>
            <BgImage source={
                Img
            } />
        </Wrapper>
    )
}
