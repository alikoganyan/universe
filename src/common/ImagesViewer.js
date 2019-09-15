import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native'
import RNDeviceInfo from 'react-native-device-info'
import ImageViewer from 'react-native-image-zoom-viewer'
import CustomFastImage from './CustomFastImage'
import helper from '../utils/helpers'

const { Colors } = helper

export default class ImagesViewer extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    index: PropTypes.number,
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
  }

  state = {
    current: 0,
  }

  componentDidUpdate(prevProps) {
    const { isVisible, index } = this.props
    const { isVisible: prevIsVisible } = prevProps
    if (isVisible !== prevIsVisible && isVisible) {
      this.setState({ current: index })
    }
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
    const { images = [], onClose } = this.props
    const { current } = this.state
    return (
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          style={styles.closeTouch}
        >
          <View style={styles.closeRotation}>
            <Text style={styles.closeText}>+</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.indicator}>
          {current + 1}/{images && images.length}
        </Text>
      </View>
    )
  }

  render() {
    const { images = [], isVisible, onClose } = this.props
    const { current } = this.state
    const imagesList = images.map(image => ({
      url: image,
    }))
    return (
      <Modal visible={isVisible} transparent>
        <ImageViewer
          imageUrls={imagesList}
          index={current}
          renderImage={this._renderImage}
          enableSwipeDown
          onCancel={onClose}
          onSwipeDown={onClose}
          onChange={this._onChange}
          renderHeader={this._renderHeader}
          renderIndicator={() => {}}
        />
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    ...Platform.select({
      ios: {
        marginTop: RNDeviceInfo.hasNotch() ? 40 : 20,
      },
      android: {
        marginTop: 0,
      },
    }),
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    lineHeight: 14,
    color: Colors.white,
    textAlign: 'center',
  },
  closeTouch: {
    position: 'absolute',
    right: 0,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    zIndex: 100,
  },
  closeRotation: {
    width: 48,
    height: 48,
  },
  closeText: {
    fontFamily: 'OpenSans',
    color: Colors.white,
    fontSize: 40,
    marginTop: -8,
    textAlign: 'center',
    transform: [{ rotate: '45deg' }],
  },
  image: {
    ...Platform.select({
      ios: {
        marginTop: -48 - (RNDeviceInfo.hasNotch() ? 40 : 20),
      },
      android: {
        marginTop: 0,
      },
    }),
  },
})
