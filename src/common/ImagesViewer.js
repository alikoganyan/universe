import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  BackHandler,
} from 'react-native'
import RNDeviceInfo from 'react-native-device-info'
import ImageViewer from 'react-native-image-zoom-viewer'
import CustomFastImage from './CustomFastImage'
import helper from '../utils/helpers'
import * as icons from '../assets/icons'

const { Colors } = helper

export default class ImagesViewer extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        actions: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            event: PropTypes.func,
          }),
        ),
      }),
    ),
    index: PropTypes.number,
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
  }

  state = {
    current: 0,
    isMenuVisible: false,
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    )
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  componentDidUpdate(prevProps) {
    const { isVisible, index } = this.props
    const { isVisible: prevIsVisible } = prevProps
    if (isVisible !== prevIsVisible && isVisible) {
      this.setState({ current: index })
    }
  }

  handleBackPress = () => {
    this._onCloseViewer() // works best when the goBack is async
    return true
  }

  _onPressDots = () => {
    const { isMenuVisible } = this.state
    if (isMenuVisible) {
      this._onHideMenu()
    } else {
      this._onShowMenu()
    }
  }

  _onShowMenu = () => {
    this.setState({ isMenuVisible: true })
  }

  _onHideMenu = () => {
    this.setState({ isMenuVisible: false })
  }

  _onChange = index => {
    this.setState({ current: index })
  }

  _renderImage = props => {
    return (
      <CustomFastImage
        {...props}
        style={[props.style && props.style, styles.image]}
      />
    )
  }

  _renderHeader = () => {
    const { images = [] } = this.props
    const { current } = this.state
    return (
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this._onCloseViewer}
          style={styles.headerButton}
        >
          <Image source={icons.back_arrow_white} />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle} numberOfLines={1}>
            {images[current] && images[current].title}
          </Text>
          <Text style={styles.infoDescription} numberOfLines={1}>
            {images[current] && images[current].description}
          </Text>
        </View>
        {images[current] &&
          images[current].actions &&
          images[current].actions.length && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this._onPressDots}
              style={styles.headerButton}
            >
              <Image source={icons.vertical_dots_white} />
            </TouchableOpacity>
          )}
      </View>
    )
  }

  _onCloseViewer = () => {
    const { onClose } = this.props
    this._onHideMenu()
    onClose()
  }

  render() {
    const { images = [], isVisible } = this.props
    const { current, isMenuVisible } = this.state
    const imagesList = images.map(({ image = '' }) => ({
      url: image,
    }))
    if (isVisible) {
      return (
        <View style={styles.container}>
          {this._renderHeader()}
          <ImageViewer
            imageUrls={imagesList}
            index={current}
            renderImage={this._renderImage}
            menus={() => {}}
            enableSwipeDown
            swipeDownThreshold={120}
            onCancel={this._onCloseViewer}
            onSwipeDown={this._onCloseViewer}
            onChange={this._onChange}
            renderIndicator={() => {}}
          />
          {isMenuVisible &&
            images[current] &&
            images[current].actions &&
            images[current].actions.length && (
              <Fragment>
                <TouchableOpacity
                  style={styles.menuBackground}
                  activeOpacity={1}
                  onPress={this._onHideMenu}
                />
                <View style={styles.menuContainer}>
                  {images[current].actions.map(({ title, action }, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this._onCloseViewer()
                        action && action()
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.menuText}>{title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Fragment>
            )}
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.black,
    ...Platform.select({
      ios: {
        paddingTop: RNDeviceInfo.hasNotch() ? 40 : 20,
      },
      android: {
        paddingTop: 0,
      },
    }),
  },
  header: {
    backgroundColor: Colors.black,
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  infoContainer: {
    flexGrow: 1,
    width: 0,
  },
  infoTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 14,
    color: Colors.white,
  },
  infoDescription: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    lineHeight: 12,
    color: Colors.white,
  },
  headerButton: {
    width: 52,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {},
  menuBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    ...Platform.select({
      ios: {
        top: 52 + (RNDeviceInfo.hasNotch() ? 40 : 20),
      },
      android: {
        top: 52,
      },
    }),
    right: 0,
    backgroundColor: '#0006',
    alignItems: 'flex-end',
  },
  menuContainer: {
    position: 'absolute',
    width: '50%',
    ...Platform.select({
      ios: {
        top: 52 + (RNDeviceInfo.hasNotch() ? 40 : 20),
      },
      android: {
        top: 52,
      },
    }),
    right: 0,
  },
  menuText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    lineHeight: 12,
    padding: 12,
    textAlign: 'center',
    color: Colors.white,
    backgroundColor: Colors.black,
  },
})
