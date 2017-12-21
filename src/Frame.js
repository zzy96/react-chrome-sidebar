import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import { css } from 'glamor'
import { node, object, string, number, func } from 'prop-types'
import App from './App'

const iframeClass = css({
  position: 'fixed',
  border: 'none',
  width: '100%',
  height: '100%',
  background: 'white',
  borderRadius: '8px',
  boxShadow: '-1px 1px 8px rgba(0,0,0,.15)'
})

const maskClass = css({
  display: 'none',
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  cursor: 'pointer',
  zIndex: '9999'
})

const maskVisibleClass = css({
  display: 'block'
})

const containerClass = css({
  position: 'fixed',
  top: '0px',
  right: '0px',
  height: '100%',
  width: '65%',
  maxWidth: '400px',
  padding: '8px',
  boxSizing: 'border-box',
  transform: 'translateX(100%)',
  transition: 'transform .45s cubic-bezier(0, 0, 0.3, 1)',
  zIndex: 10000
})

const containerVisibleClass = css({
  transform: 'translate3d(0,0,0)'
})

const containerMinimizedClass = css({
  cursor: 'pointer',
  transform: 'translateX(94%)',
  ':hover': {
    transform: 'translateX(92%)'
  },
  '& > iframe': {
    pointerEvents: 'none'
  }
})

const FRAME_TOGGLE_FUNCTION = 'chromeIframeSheetToggle'

class Frame extends Component {
  render() {
    const { isVisible, isMinimized } = this.state
    const {
      className,
      maskClassName,
      maskStyle,
      containerClassName,
      containerStyle,
      iframeClassName,
      iframeStyle,
    } = this.props

    return (
      <div>
        <div
          className={cx({
            [maskClass]: true,
            [maskVisibleClass]: !isMinimized,
            [maskClassName]: true
          })}
          style={maskStyle}
          onClick={this.onMaskClick}
          ref={mask => this.mask = mask}
        />

        <div
          className={cx({
            [containerClass]: true,
            [containerVisibleClass]: isVisible,
            [containerMinimizedClass]: isMinimized,
            [containerClassName]: true
          })}
          style={containerStyle}
          onClick={this.onFrameClick}
        >
          <div
            className={cx({
              [iframeClass]: true,
              [iframeClassName]: true
            })}
            style={iframeStyle}
            ref={frame => this.frame = frame}
          >
            <App />
          </div>
        </div>
      </div>
    )
  }

  state = {
    isVisible: false,
    isMinimized: false
  }

  static defaultProps = {
    delay: 500,
    maskClassName: '',
    maskStyle: {},
    containerClassName: '',
    containerStyle: {},
    iframeClassName: '',
    iframeStyle: {},
    onMount: () => {},
    onUnmount: () => {}
  }

  static propTypes = {
    delay: number,
    maskClassName: string,
    maskStyle: object,
    containerClassName: string,
    containerStyle: object,
    iframeClassName: string,
    iframeStyle: object,
    onMount: func,
    onUnmount: func
  }

  componentDidMount() {
    const { delay, onMount } = this.props

    window[FRAME_TOGGLE_FUNCTION] = this.toggleFrame

    onMount({
      mask: this.mask,
      frame: this.frame
    })

    this._visibleRenderTimeout = setTimeout(() => {
      this.setState({
        isVisible: true
      })
    }, delay)
  }

  componentWillUnmount() {
    const { onUnmount } = this.props

    onUnmount({
      mask: this.mask,
      frame: this.frame
    })

    delete window[FRAME_TOGGLE_FUNCTION]
    clearTimeout(this._visibleRenderTimeout)
  }

  onMaskClick = () => {
    this.setState({
      isMinimized: true
    })
  }

  onFrameClick = () => {
    this.setState({
      isMinimized: false
    })
  }

  toggleFrame = () => {
    this.setState({
      isMinimized: !this.state.isMinimized
    })
  }

  static isReady() {
    return typeof window[FRAME_TOGGLE_FUNCTION] !== 'undefined'
  }

  static toggle() {
    if (window[FRAME_TOGGLE_FUNCTION]) {
      window[FRAME_TOGGLE_FUNCTION]()
    }
  }
}

if (Frame.isReady()) {
  Frame.toggle()
} else {
  const root = document.createElement('div')
  document.body.appendChild(root)
  ReactDOM.render(<Frame />, root) 
}