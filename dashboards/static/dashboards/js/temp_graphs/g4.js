/**
 * IGNORE THIS FILE
 * TO DELETE
 */

import { Canvas } from '../builders/BuildingBlocks.js';

export class G4 extends Canvas {

    constructor(id) {

        super();

        this.setId(id);
        this.setStyle("width","100%");
        this.setStyle("max-height","300px");


        const data = {
            labels: [
              'Red',
              'Green',
              'Yellow',
              'Grey',
              'Blue'
            ],
            datasets: [{
              label: 'My First Dataset',
              data: [11, 16, 7, 3, 14],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)'
              ]
            }]
          };
          const config = {
            type: 'polarArea',
            data: data,
            options: {}
          };
   const stackedLine = new Chart(this.dom, config);   

    }

}

