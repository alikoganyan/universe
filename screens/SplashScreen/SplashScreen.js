import React, { Component } from 'react'
import { Text, View, Image, Dimensions } from 'react-native'
import styled from 'styled-components'
import Img320 from '../../assets/splash/320x480.png'
import Img480 from '../../assets/splash/480x800.png'
import Img960 from '../../assets/splash/960x1600.png'
import Img1125 from '../../assets/splash/1125×2436.png'
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
                Img1125
            } />
        </Wrapper>
    )
}
