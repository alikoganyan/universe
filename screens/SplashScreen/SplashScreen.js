import React from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components';
import Img1125 from '../../assets/splash/1125×2436.png';

const Wrapper = styled(View)`
    height: 100%;
    width: 100%;
`;
const BgImage = styled(Image)`
    height: 100%;
    width: 100%;
`;
export default function SplashScreen() {
  return (
    <Wrapper>
      <BgImage source={
                Img1125
            }
      />
    </Wrapper>
  );
}
