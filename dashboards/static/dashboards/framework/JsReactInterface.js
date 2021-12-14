import React, { useState, useEffect } from 'react';
import GraphChooser from "./components/GraphChooser";


export default function JsReactInterface(props) {

    const [options, setOptions] = useState(false);

    const data = props.data;
    const userID = 1;
    const identifier = ['page_name', 1, userID]; // Identifier Array, args: Page Name, ID, User ID

    useEffect(() => {
        props.channel.addEventListener("message", (event) => {
            if (event.data.id === props.id && event.data.operation === 'show_options') {
                setOptions(current => !current)
            }
        });
    },[props.channel, props.id])

    return (
        <div>
            <GraphChooser data={data} identifier={identifier} options={[options, setOptions]}/>
        </div>
    );
}


  
  