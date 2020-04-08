import { PureComponent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

class Portal extends PureComponent<{
  children: ReactNode;
  targetRef?: React.RefObject<HTMLElement> | HTMLElement | HTMLBodyElement;
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
    console.log('targetRef', targetRef, typeof targetRef);

    if (!targetRef) {
      document.body.appendChild(this.container);
    } else if ('current' in targetRef && targetRef.current) {
      targetRef.current.appendChild(this.container);
    } else if (targetRef instanceof HTMLBodyElement) {
      console.log('targetRef: ', targetRef);
      targetRef.appendChild(this.container);
    } else if (targetRef instanceof HTMLElement) {
      console.log('targetRef: ', targetRef);
      targetRef.appendChild(this.container);
    } else {
      console.log(targetRef instanceof HTMLBodyElement);
      console.table(targetRef);

      // @ts-ignore
      targetRef.appendChild(this.container);
    }

    this.setState({
      canRender: true
    });
  }

  componentWillUnmount() {
    const { targetRef } = this.props;

    if (!targetRef) {
      document.body.removeChild(this.container);
    } else if ('current' in targetRef && targetRef.current) {
      targetRef.current.removeChild(this.container);
    } else if (
      targetRef instanceof HTMLElement ||
      targetRef instanceof HTMLBodyElement
    ) {
      debugger;
      targetRef.removeChild(this.container);
    }
  }

  render() {
    return (
      this.state.canRender && createPortal(this.props.children, this.container)
    );
  }
}

export { Portal };
