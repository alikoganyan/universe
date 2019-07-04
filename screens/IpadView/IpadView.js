import React from 'react';
import { View, WebView } from 'react-native';
import styled from 'styled-components';
import SafeAreaView from '../../common/SafeAreaView';
import helper from '../../utils/helpers';

const { HeaderHeight } = helper;
const Header = styled(View)
`
    width: 100%;
    background: white;
    height: ${HeaderHeight}; 
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export default () => (
	// <SafeAreaView>
		<WebView
			source={{ uri: 'http://univ.team' }}
			style={{ flex: 1 }}
		/>
	// </SafeAreaView>
);
