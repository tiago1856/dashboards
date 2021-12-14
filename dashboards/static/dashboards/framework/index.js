import React from 'react';
import ReactDOM from 'react-dom';

import JsReactInterface from './JsReactInterface';


const bc3 = new BroadcastChannel('react_channel');
bc3.addEventListener("message", (event) => {
  if (event.data.operation === 'create_component') {
    const id = event.data.id;
    //const type = event.data.type;
    const data = event.data.data;
    ReactDOM.render(<JsReactInterface data={data} id={id} channel={bc3} />, document.getElementById(id));
  }
});


/*
ReactDOM.render(
  <OneNumInterface data={data} channel = {bc3} />,
document.getElementById('root')
);
*/
