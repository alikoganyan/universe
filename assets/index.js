import React from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components'
import helper from '../utils/helpers'
import SVG from './svg/'
import SvgUri from 'react-native-svg-uri';

const { IconDarkColor,
    IconLightColor,
    IconBlueColor,
    IconSize,
    IconSizeSmall,
    IconSizeLarge,
    sidePadding } = helper;

const StyledTouchableOpacity = styled(TouchableOpacity)`
    margin-left: ${({ left }) => left ? Dimensions.get('window').width*0.085 : 0};
    margin-right: ${({ right }) => right ? Dimensions.get('window').width*0.085 : 0};
    padding: 2px;
`
const Left = styled(StyledTouchableOpacity)`
    margin-right: ${({ noPadding }) => noPadding ? 0 : 10}px;
    padding: ${({ noPadding }) => noPadding ? 0 : 10}px;
    ${({ style }) => style}
`
const Right = styled(StyledTouchableOpacity)`
    margin-left: ${({ noPadding }) => noPadding ? 0 : 10}px;
    padding: ${({ noPadding }) => noPadding ? 0 : 10}px;
    ${({ style }) => style}
`
// ${({ color }) => color || IconLightColor}
const TriangleLeft = styled(View)`
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 0;
    border-right-width: 15px;
    border-bottom-width: 15px;
    border-color: transparent;
    border-bottom-color: ${({ color }) => color || IconLightColor};    
    position: relative;
    align-self: flex-end;
    left: 5px;
    top: -5px;
    line-height: 0px;
    ${({ style }) => style};
`
const TriangleLeftInner = styled(TriangleLeft)`
`

const TriangleRight = styled(View)`
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 0;
    border-left-width: 15px;
    border-bottom-width: 15px;
    border-color: transparent;
    border-bottom-color: ${({ color }) => color || IconLightColor};    
    position: relative;
    align-self: flex-end;
    left: 5px;
    top: -5px;
    line-height: 0px;
    ${({ style }) => style};
`
const TriangleRightInner = styled(TriangleRight)`
`

const LeftWrapper = function (props) {
    const { children, onPress } = props;
    return (
        <Left style={{ ...props.style }} onPress={props.props.onPress} noPadding={props.noPadding}>
            <Text>
                {children}
            </Text>
        </Left>
    )
}
const RightWrapper = function (props) {
    const { children } = props;
    return (
        <Right style={{ ...props.style }} onPress={props.props.onPress} noPadding={props.noPadding}>
            <Text>
                {children}
            </Text>
        </Right>
    )
}
export function BackIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Arrow_back}
            />
        </StyledTouchableOpacity>
    )
}

export function ForwardIcon(props) {
    return (
        <LeftWrapper props={props}>

            <Icon name="angle-right" size={IconSize} color={IconDarkColor} />
        </LeftWrapper >
    )
}


export function EllipsisVIcon(props) {
    return (
        <RightWrapper props={props}>

            <Icon name="ellipsis-v" size={IconSize} color={IconDarkColor} />

        </RightWrapper>
    )
}


export function SmileIcon(props) {
    return (
        <LeftWrapper props={props}>

            <Icon name="smile-o" size={IconSize} color={IconDarkColor} />

        </LeftWrapper>
    )
}

export function FileIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.File}
            />
        </StyledTouchableOpacity>
    )
}
export function FilesRedIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Files_red}
            />
        </StyledTouchableOpacity>
    )
}

export function CameraIcon(props) {
    return (
        <RightWrapper props={props}>


            <Icon name="camera" size={IconSize} color={IconDarkColor} />

        </RightWrapper>
    )
}


export function BurgerIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Menu}
            />
        </StyledTouchableOpacity>
    )
}

export function SearchIcon(props) {
    const { onPress, left, right } = props;
    console.log(left, right)
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Search}
            />
        </StyledTouchableOpacity>
    )
}


export function TriangleLeftIcon({ color, style, hollow }) {
    return (
        <TriangleLeft color={color || IconDarkColor} style={{ ...style }}>
            {hollow && <TriangleLeftInner color={'#fff'} style={{
                ...style,
                position: 'relative',
                borderRightWidth: 15,
                borderTopWidth: 15,
                top: -16,
                left: 12.5,
            }} />}
        </TriangleLeft>
    )
}

export function TriangleRightIcon({ color, style, hollow }) {
    return (
        <TriangleRight color={color || IconDarkColor} style={{ ...style }}>
            {hollow && <TriangleRightInner color={'#fff'} style={{
                ...style,
                position: 'relative',
                borderLeftWidth: 15,
                borderBottomWidth: 15,
                top: -1,
                left: 2,
            }} />}
        </TriangleRight>
    )
}

export function LocationIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Geolocation}
            />
        </StyledTouchableOpacity>
    )
}

export function ImageIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Files_white}
            />
        </StyledTouchableOpacity>
    )
}

export function MessageIndicatorIcon(props) {
    return (
        <Text>
            <Icon name="check" size={IconSize} color={IconDarkColor} />
        </Text>
    )
}


export function EditIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Edit}
            />
        </StyledTouchableOpacity>
    )
}


export function FunnelIcon(props) {
    return (
        <LeftWrapper props={props}>
            <Ionicons name="ios-funnel" size={IconSize} color={IconDarkColor} />
        </LeftWrapper>
    )
}
export function HeartIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSizeSmall}
                height={IconSizeSmall}
                source={SVG.Likes}
            />
        </StyledTouchableOpacity>
    )
}

export function CommentIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSizeSmall}
                height={IconSizeSmall}
                source={SVG.Comments}
            />
        </StyledTouchableOpacity>
    )
}

export function CloseIcon(props) {
    const { onPress, style, left, right } = props
    return (
        <StyledTouchableOpacity onPress={onPress} style={style} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Close}
            />
        </StyledTouchableOpacity>
    )
}

export function GroupIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Contacts_grey}
            />
        </StyledTouchableOpacity>
    )
}


export function GroupIconWhite(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Contacts_white}
            />
        </StyledTouchableOpacity>
    )
}

export function TaskIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Tasks}
            />
        </StyledTouchableOpacity>
    )
}
export function DialogsIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Dialog}
            />
        </StyledTouchableOpacity>
    )
}

export function CheckIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Message_delivered}
            />
        </StyledTouchableOpacity>
    )
}

export function CheckAllIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Message_read}
            />
        </StyledTouchableOpacity>
    )
}
export function PapperPlaneIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.New_dialog}
            />
        </StyledTouchableOpacity>
    )
}
export function FeedIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.News}
            />
        </StyledTouchableOpacity>
    )
}
export function TasksIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Tasks}
            />
        </StyledTouchableOpacity>
    )
}
export function SettingsIcon(props) {
    const { onPress, left, right } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Settings}
            />
        </StyledTouchableOpacity>
    )
}
export function AddIcon(props) {
    const { onPress, left, right, size } = props;
    console.log(left, right)    
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={size || IconSize}
                height={size || IconSize}
                source={SVG.Add}
            />
        </StyledTouchableOpacity>
    )
}

export function IntroIcon(props) {
    const { onPress, left, right, size } = props;
    return (
        <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
            <SvgUri
                width={size || IconSize}
                height={size || IconSize}
                source={SVG.Intro}
            />
        </StyledTouchableOpacity>
    )
}

export function ArrowDownIcon(props) {
    return (
        <Icon name="angle-down" size={IconSizeLarge} color={IconDarkColor} />
    )
}
