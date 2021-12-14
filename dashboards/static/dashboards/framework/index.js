import React from 'react';
import ReactDOM from 'react-dom';

import OneNumInterface from './OneNumInterface';


const bc3 = new BroadcastChannel('react_channel');
bc3.addEventListener("message", (event) => {
  if (event.data.operation === 'create_component') {
    const id = event.data.id;
    const type = event.data.type;
    const data = event.data.data;
    switch (type) {
      case '1-numerical':
        ReactDOM.render(<OneNumInterface data={data} id={id} channel={bc3} />, document.getElementById(id));
        break;
      /*
      case 'n-numerical':
        ReactDOM.render(<OneNumInterface data={data} channel={bc3} />, document.getElementById(id));
        break;
      */
      default:
    }
  }
});


/*
ReactDOM.render(
  <OneNumInterface data={data} channel = {bc3} />,
document.getElementById('root')
);
*/
