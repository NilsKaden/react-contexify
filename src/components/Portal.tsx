import { PureComponent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

class Portal extends PureComponent<{
  children: ReactNode;
  targetRef?: React.RefObject<HTMLElement> | HTMLElement | HTMLBodyElement;
  isRenderingToCustomTarget?: boolean;
}> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    targetRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ]),
    isRenderingToCustomTarget: PropTypes.bool
  };

  static defaultProps = {
    isRenderingToCustomTarget: false
  };

  state = {
    canRender: false
  };
  container = {} as HTMLDivElement;

  componentDidMount() {
    const { isRenderingToCustomTarget } = this.props;
    this.container = document.createElement('div');

    if (!isRenderingToCustomTarget) {
      document.body.appendChild(this.container);
    } else {
      // @ts-ignore
      const iframeBody: HTMLBodyElement = document.body.querySelector('iframe')
        .contentWindow.document.body;
      console.log(iframeBody, typeof iframeBody, this.container);
      iframeBody.appendChild(this.container);
    }

    this.setState({
      canRender: true
    });
  }

  componentWillUnmount() {
    const { isRenderingToCustomTarget } = this.props;

    if (!isRenderingToCustomTarget) {
      document.body.removeChild(this.container);
    } else {
      // @ts-ignore
      const iframeBody: HTMLBodyElement = document.body.querySelector('iframe')
        .contentWindow.document.body;
      console.log(iframeBody, typeof iframeBody, this.container);
      iframeBody.removeChild(this.container);
    }
  }

  render() {
    return (
      this.state.canRender && createPortal(this.props.children, this.container)
    );
  }
}

export { Portal };
