import { PureComponent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

class Portal extends PureComponent<{
  children: ReactNode;
  targetRef?: React.RefObject<HTMLElement>;
}> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    targetRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.any })
    ])
  };

  state = {
    canRender: false
  };
  container = {} as HTMLDivElement;

  componentDidMount() {
    const { targetRef } = this.props;
    this.container = document.createElement('div');
    if (!targetRef || !targetRef.current) {
      document.body.appendChild(this.container);
    } else {
      targetRef.current.appendChild(this.container);
    }

    this.setState({
      canRender: true
    });
  }

  componentWillUnmount() {
    const { targetRef } = this.props;
    if (!targetRef || !targetRef.current) {
      document.body.removeChild(this.container);
    } else {
      targetRef.current.removeChild(this.container);
    }
  }

  render() {
    return (
      this.state.canRender && createPortal(this.props.children, this.container)
    );
  }
}

export { Portal };
