import React from 'react';
import ReactDOM from 'react-dom';
import GeoDensExample from './examples/GeoDensExample';
import DoubleNumerical from './examples/DoubleNumerical';
//import DashboardExample from './examples/DashboardExample';
/*
ReactDOM.render(
    <DashboardExample />,
  document.getElementById('root')
);
*/

const bc3 = new BroadcastChannel('react_channel');
bc3.addEventListener("message", (event) => {
  if (event.data.operation === 'create_component') {
    const id = event.data.id;
    const type = event.data.type;
    switch (type) {
      case 'list1':
        ReactDOM.render(<DoubleNumerical />, document.getElementById(id));
        break;
      case 'list2':
        ReactDOM.render(<GeoDensExample />, document.getElementById(id));
        break;
      default:
    }
  }
});
