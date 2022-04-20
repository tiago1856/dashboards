
import { Div } from '../builders/BuildingBlocks.js';


 export class OptionInput extends Div {
    constructor(input_data) {
        super();
        this.input_data = input_data;
        this.input = null;
    };
    
    getData() {
        if (this.input)
           return {id: this.input_data.id, value: this.input.getValue()};
       else
           return {id: this.input_data.id, value: null};
   };
}