import React from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styled from 'styled-components'
import helper from '../utils/helpers'
import * as ICONS from './icons'

const {
  IconDarkColor,
  IconLightColor,
  IconSize,
  IconSizeSmall,
  IconSizeLarge,
} = helper

const StyledTouchableOpacity = styled(TouchableOpacity)`
  margin-left: ${({ left }) =>
    left ? (Dimensions.get('window').height >= 1080 ? 30 : 12) : 0}px;
  margin-right: ${({ right }) =>
    right ? (Dimensions.get('window').height >= 1080 ? 30 : 12) : 0}px;
  padding: ${({ noPadding, noPaddingAll }) =>
    noPadding ? (noPaddingAll ? 0 : '0 12') : noPaddingAll ? 0 : '10px 12'}px;
  position: relative;
  left: ${({ marginLeft, marginRight }) =>
    marginLeft ? -12 : marginRight ? 12 : 0}px;
`
const StyledView = styled(View)`
  margin-left: ${({ left }) =>
    left ? (Dimensions.get('window').height >= 1080 ? 30 : 12) : 0}px;
  margin-right: ${({ right }) =>
    right ? (Dimensions.get('window').height >= 1080 ? 30 : 12) : 0}px;
  padding: ${({ noPadding, noPaddingAll }) =>
    noPadding ? (noPaddingAll ? 0 : '0 12') : noPaddingAll ? 0 : '10px 12'}px;
  position: relative;
  left: ${({ marginLeft, marginRight }) =>
    marginLeft ? -12 : marginRight ? 12 : 0}px;
`
const Left = styled(StyledTouchableOpacity)`
  margin-right: ${({ noPadding }) => (noPadding ? 0 : 10)}px;
  padding: ${({ noPadding }) => (noPadding ? 0 : 10)}px;
  ${({ style }) => style}
`
const Right = styled(StyledTouchableOpacity)`
  margin-left: ${({ noPadding }) => (noPadding ? 0 : 10)}px;
  padding: ${({ noPadding }) => (noPadding ? 0 : 10)}px;
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
  left: -15px;
  top: -5px;
  line-height: 0px;
  ${({ style }) => style};
`
const TriangleLeftInner = styled(TriangleLeft)``

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
  left: 0px;
  top: -5px;
  line-height: 0px;
  ${({ style }) => style};
`
const TriangleRightInner = styled(TriangleRight)``

const LeftWrapper = props => {
  const { children, onPress, style, noPadding } = props
  return (
    <Left style={{ ...style }} onPress={onPress} noPadding={noPadding}>
      <Text>{children}</Text>
    </Left>
  )
}
const RightWrapper = props => {
  const { children } = props
  return (
    <Right>
      <Text>{children}</Text>
    </Right>
  )
}
export function BackIcon(props) {
  const {
    onPress,
    left,
    right,
    noPadding,
    noPaddingAll,
    marginLeft = true,
    size = IconSize,
    ...rest
  } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPadding={noPadding}
      noPaddingAll={noPaddingAll}
      marginLeft={marginLeft}
      {...rest}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Arrow_back}
            /> */}
      <Image
        style={{ width: size, height: size }}
        resizeMode="contain"
        source={ICONS.Arrow_back_blue}
      />
    </StyledTouchableOpacity>
  )
}
export function ArrowRightIcon(props) {
  const { onPress, left, right, noPadding, noPaddingAll, marginLeft } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPadding={noPadding}
      noPaddingAll={noPaddingAll}
      marginLeft={marginLeft}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Arrow_back}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Arrow_right_yellow}
      />
    </StyledTouchableOpacity>
  )
}

export function ForwardIcon(props) {
  return (
    <LeftWrapper props={props}>
      <Icon name="angle-right" size={IconSize} color={IconDarkColor} />
    </LeftWrapper>
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
  const { onPress, left, right } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.File}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Files}
      />
    </StyledTouchableOpacity>
  )
}
export function FilesRedIcon(props) {
  const { onPress, left, right, noPaddingAll, size } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Files_red}
            /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Files_red}
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
  const { onPress, left, right } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Menu}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Menu}
      />
    </StyledTouchableOpacity>
  )
}

export function SearchIcon(props) {
  const { onPress, left, right } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Search}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Search_blue}
      />
    </StyledTouchableOpacity>
  )
}

export function SearchIconGray(props) {
  const { left, right } = props
  return (
    <StyledView left={left} right={right}>
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Search_gray}
      />
    </StyledView>
  )
}

export function TriangleLeftIcon({
  color,
  colorInner = '#fff',
  style,
  hollow,
  styleInner,
}) {
  return (
    <TriangleLeft color={color || IconDarkColor} style={{ ...style }}>
      {hollow && (
        <TriangleLeftInner
          color={colorInner}
          style={{
            ...style,
            position: 'relative',
            borderRightWidth: 15,
            borderTopWidth: 15,
            top: -16,
            left: 12.5,
            ...styleInner,
          }}
        />
      )}
    </TriangleLeft>
  )
}

export function TriangleRightIcon({
  color,
  colorInner = '#fff',
  style,
  hollow,
  styleInner,
}) {
  return (
    <TriangleRight color={color || IconDarkColor} style={{ ...style }}>
      {hollow && (
        <TriangleRightInner
          color={colorInner}
          style={{
            ...style,
            position: 'relative',
            borderLeftWidth: 15,
            borderBottomWidth: 15,
            top: -1,
            left: 2.5,
            ...styleInner,
          }}
        />
      )}
    </TriangleRight>
  )
}

export function LocationIcon(props) {
  const { onPress, left, right, marginRight = true } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      marginRight={marginRight}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Geolocation}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Geolocation_blue}
      />
    </StyledTouchableOpacity>
  )
}

export function ImageIcon(props) {
  const { onPress, left, right } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Files_white}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Files_white}
      />
    </StyledTouchableOpacity>
  )
}

export function ImageIconBlue(props) {
  const { onPress, left, right } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Files_white}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Files}
      />
    </StyledTouchableOpacity>
  )
}

export function MessageIndicatorIcon() {
  return (
    <Text>
      <Icon name="check" size={IconSize} color={IconDarkColor} />
    </Text>
  )
}

export function EditIcon(props) {
  const {
    onPress,
    left,
    right,
    marginRight = true,
    noPaddingAll,
    nonClickable,
  } = props
  return !nonClickable ? (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      marginRight={marginRight}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                    width={IconSize}
                    height={IconSize}
                    source={SVG.Edit}
                /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Edit}
      />
    </StyledTouchableOpacity>
  ) : (
    <Image
      style={{ width: IconSize, height: IconSize }}
      resizeMode="contain"
      source={ICONS.Edit}
    />
  )
}

export function HeartIcon(props) {
  const { onPress, left, right, marginRight } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      marginRight={marginRight}
    >
      {/* <SvgUri
                width={IconSizeSmall}
                height={IconSizeSmall}
                source={SVG.Likes}
            /> */}
      <Image
        style={{ width: IconSizeSmall, height: IconSizeSmall }}
        resizeMode="contain"
        source={ICONS.Likes}
      />
    </StyledTouchableOpacity>
  )
}
export function HeartIconFilled(props) {
  const { onPress, left, right, marginRight } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      marginRight={marginRight}
    >
      {/* <SvgUri
                width={IconSizeSmall}
                height={IconSizeSmall}
                source={SVG.Likes}
            /> */}
      <Image
        style={{ width: IconSizeSmall, height: IconSizeSmall }}
        resizeMode="contain"
        source={ICONS.Like}
      />
    </StyledTouchableOpacity>
  )
}

export function CommentIcon(props) {
  const { onPress, left, right } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={IconSizeSmall}
                height={IconSizeSmall}
                source={SVG.Comments}
            /> */}
      <Image
        style={{ width: IconSizeSmall, height: IconSizeSmall }}
        resizeMode="contain"
        source={ICONS.Comments}
      />
    </StyledTouchableOpacity>
  )
}

export function CloseIcon(props) {
  const {
    onPress,
    style,
    left,
    right,
    noPadding,
    noPaddingAll,
    marginLeft = true,
    marginRight,
  } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      style={style}
      left={left}
      right={right}
      noPadding={noPadding}
      noPaddingAll={noPaddingAll}
      marginLeft={marginLeft}
      marginRight={marginRight}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Close}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Close}
      />
    </StyledTouchableOpacity>
  )
}
export function GroupIcon(props) {
  const { onPress, left, right, size, noPaddingAll, nonClickable } = props
  return !nonClickable ? (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                    width={IconSize}
                    height={IconSize}
                    source={SVG.Contacts_grey}
                /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Contacts}
      />
    </StyledTouchableOpacity>
  ) : (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.Contacts}
    />
  )
}

export function GroupIconWhite(props) {
  const { left, right } = props
  return (
    <StyledView left={left} right={right}>
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Contacts_white}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Contacts_white}
      />
    </StyledView>
  )
}
export function UserIconWhite(props) {
  const { left, right } = props
  return (
    <StyledView left={left} right={right}>
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Contacts_white}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.User}
      />
    </StyledView>
  )
}
export function GroupIconGrey(props) {
  const { onPress, left, right = true, noPaddingAll = true } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Contacts_white}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Contacts_grey}
      />
    </StyledTouchableOpacity>
  )
}

export function TaskIcon(props) {
  const { onPress, left, right, noPaddingAll } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Tasks}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Tasks}
      />
    </StyledTouchableOpacity>
  )
}
export function DialogsIcon(props) {
  const { onPress, left, right, size, nonClickable } = props
  return !nonClickable ? (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                    width={IconSize}
                    height={IconSize}
                    source={SVG.Dialog}
                /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Dialog}
      />
    </StyledTouchableOpacity>
  ) : (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.Dialog}
    />
  )
}

export function CheckGreyIcon(props) {
  const { onPress, left, right, noPaddingAll, size, marginRight } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPaddingAll={noPaddingAll}
      marginRight={marginRight}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Message_delivered}
            /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Task_delivered}
      />
    </StyledTouchableOpacity>
  )
}

export function CheckIcon(props) {
  const {
    color = 'white',
    onPress,
    left = true,
    right,
    noPaddingAll = true,
  } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Message_delivered}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={
          color === 'white'
            ? ICONS.Message_delivered
            : ICONS.Message_delivered_blue
        }
      />
    </StyledTouchableOpacity>
  )
}

export function CheckAllIcon(props) {
  const {
    color = 'white',
    onPress,
    left = true,
    right,
    noPaddingAll = true,
  } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Message_read}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={
          color === 'white' ? ICONS.Message_read : ICONS.Message_read_blue
        }
      />
    </StyledTouchableOpacity>
  )
}
export function PapperPlaneIcon(props) {
  const { onPress, left, right, size, nonClickable } = props
  return !nonClickable ? (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                    width={IconSize}
                    height={IconSize}
                    source={SVG.New_dialog}
                /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.New_dialog}
      />
    </StyledTouchableOpacity>
  ) : (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.New_dialog}
    />
  )
}
export function FeedIcon(props) {
  const { onPress, left, right, size, nonClickable } = props
  return !nonClickable ? (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                    width={IconSize}
                    height={IconSize}
                    source={SVG.News}
                /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.News}
      />
    </StyledTouchableOpacity>
  ) : (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.News}
    />
  )
}
export function TasksIcon(props) {
  const {
    onPress,
    left,
    right,
    noPaddingAll = true,
    size,
    nonClickable,
  } = props
  return !nonClickable ? (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                    width={IconSize}
                    height={IconSize}
                    source={SVG.Tasks}
                /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Tasks}
      />
    </StyledTouchableOpacity>
  ) : (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.Tasks}
    />
  )
}
export function SettingsIcon(props) {
  const { onPress, left, right, size, nonClickable } = props
  return !nonClickable ? (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                    width={IconSize}
                    height={IconSize}
                    source={SVG.Settings}
                /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Settings}
      />
    </StyledTouchableOpacity>
  ) : (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.Settings}
    />
  )
}
export function AddIcon(props) {
  const { onPress, left, right, size } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={size || IconSize}
                height={size || IconSize}
                source={SVG.Add}
            /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Add}
      />
    </StyledTouchableOpacity>
  )
}

export function AddIconBlue(props) {
  const { onPress, left, right, size } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={size || IconSize}
                height={size || IconSize}
                source={SVG.Add}
            /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Add_blue}
      />
    </StyledTouchableOpacity>
  )
}

export function IntroIcon(props) {
  const { onPress, left, right, size } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={size || IconSize}
                height={size || IconSize}
                source={SVG.Intro}
            /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Intro}
      />
    </StyledTouchableOpacity>
  )
}

export function LogoText(props) {
  const {
    onPress,
    left,
    right,
    size,
    width,
    height,
    noPadding,
    noPaddingAll,
  } = props
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      left={left}
      right={right}
      noPadding={noPadding}
      noPaddingAll={noPaddingAll}
    >
      {/* <SvgUri
                width={size || IconSize}
                height={size || IconSize}
                source={SVG.Intro}
            /> */}
      <Image
        style={{
          width: width || size || IconSize,
          height: height || size || IconSize,
        }}
        resizeMode="contain"
        source={ICONS.logo_blue}
      />
    </StyledTouchableOpacity>
  )
}
export function SearchShadow(props) {
  const { size } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.logo_blue}
    />
  )
}
export function DoneIcon(props) {
  const { size } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.Done}
    />
  )
}
export function StartIcon(props) {
  const { size } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.Start}
    />
  )
}
export function RedoIcon(props) {
  const { size } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={ICONS.Redo}
    />
  )
}
export function CloseTaskIcon() {
  return (
    <Image
      style={{ width: IconSize, height: IconSize }}
      resizeMode="contain"
      source={ICONS.Close}
    />
  )
}
export function LogoPlaceholder(props) {
  const { width, height } = props
  return (
    <Image
      style={{ width: width || IconSize, height: height || IconSize }}
      resizeMode="contain"
      source={ICONS.logo_placeholder}
    />
  )
}

export function ArrowDownIcon() {
  return <Icon name="angle-down" size={IconSizeLarge} color={IconDarkColor} />
}

export function CameraIconBlue(props) {
  const { onPress, left, right, size } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={size || IconSize}
                height={size || IconSize}
                source={SVG.Add}
            /> */}
      <Image
        style={{ width: size || IconSize, height: size || IconSize }}
        resizeMode="contain"
        source={ICONS.Camera_blue}
      />
    </StyledTouchableOpacity>
  )
}

export function WriteMessageBlue(props) {
  const { onPress, left, right } = props
  return (
    <StyledTouchableOpacity onPress={onPress} left={left} right={right}>
      {/* <SvgUri
                width={IconSize}
                height={IconSize}
                source={SVG.Search}
            /> */}
      <Image
        style={{ width: IconSize, height: IconSize }}
        resizeMode="contain"
        source={ICONS.Write_message_blue}
      />
    </StyledTouchableOpacity>
  )
}

export function NewsMenuIcon(props) {
  const { size, focused } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={focused ? ICONS.Menu_news_active : ICONS.Menu_news}
    />
  )
}

export function ContactsMenuIcon(props) {
  const { size, focused } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={focused ? ICONS.Menu_contacts_active : ICONS.Menu_contacts}
    />
  )
}

export function DialogMenuIcon(props) {
  const { size, focused } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={focused ? ICONS.Menu_dialog_active : ICONS.Menu_dialog}
    />
  )
}

export function TasksMenuIcon(props) {
  const { size, focused } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={focused ? ICONS.Menu_tasks_active : ICONS.Menu_tasks}
    />
  )
}

export function SettingsMenuIcon(props) {
  const { size, focused } = props
  return (
    <Image
      style={{ width: size || IconSize, height: size || IconSize }}
      resizeMode="contain"
      source={focused ? ICONS.Menu_settings_active : ICONS.Menu_settings}
    />
  )
}
