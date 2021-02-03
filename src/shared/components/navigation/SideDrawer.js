import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames='slide-in-left'
      mountOnEnter
      unmountOnExit
    >
      {/* mountOnEnter i unmountOnEnter mówią, że aside powinienien być dodany lub usunięty z DOM, a nie tylko ukryty */}
      <aside className='side-drawer' onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );
  
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
