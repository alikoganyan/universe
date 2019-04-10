import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { View } from 'react-native'
import colors from '../constants/colors'

class Input extends PureComponent {
	state = {
		inputColor: colors.light_grey_blue
	}
	
	render() {
		const {
            icon=null, iconSize=16, onError=null,
            caption=null, readOnly=false, containerStyle,
            inputStyle, captionStyle, focusFunc,
            forwardRef, ...props
        } = this.props
		const { inputColor } = this.state
		const ERROR_COLOR = onError ? colors.rosy_pink : inputColor
		
		return (
			<Container style={ { borderColor: ERROR_COLOR, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', ...containerStyle } }>
				<View style={ { flex: 1 } }>
					{ caption && <Caption style={ captionStyle }>{ caption }</Caption> }
					<Field
						{ ...props }
						placeholderTextColor={ colors.light_grey_blue }
						onFocus={ (e) => { this.setState({ inputColor: colors.light_grey_blue }); focusFunc && focusFunc(e) } }
						onBlur={ () => this.setState({ inputColor: colors.light_grey_blue }) }
						style={ { color: onError ? colors.rosy_pink : colors.black, ...inputStyle } }
						ref={ forwardRef }
						withIcon={ Boolean(icon) }
					/>
				</View>
				
				{onError && <ErrorMessage>{onError}</ErrorMessage>}
			</Container>
		)
	}
}

export default Input

/**
 |--------------------------------------------------
 | stylesheets
 |--------------------------------------------------
 */

const Container = styled.View`
    position: relative;
    border-style: solid;
    border-bottom-width: 1px;
    border-top-width: 1px;
    border-top-color: transparent;
    margin-bottom: 30px;
    height: 30px;
`

const Caption = styled.Text`
    color: ${ colors.light_grey_blue };
    font-size: 12px;
    padding-left: 24px;
`

const Field = styled.TextInput`
	flex: 1;
    font-size: 12px;
    padding: 0 10px 2px ${ (p) => p.withIcon ? '24px' : '10px' };
`

const ErrorMessage = styled.Text`
    position: absolute;
    right: 0;
    bottom: -24px;
    color: ${ colors.rosy_pink };
    font-size: 10px;
`
