
import { Div } from '../builders/BuildingBlocks.js';


 export class OptionsInput extends Div {
    constructor(uuid, input_data) {
        super();
        this.input_data = input_data;
        this.input = null;
        this.uuid = uuid;        
    };
    
    getData() {
        if (this.input)
           return {id: this.input_data.id, value: this.input.getValue()};
       else
           return {id: this.input_data.id, value: null};
   };
}