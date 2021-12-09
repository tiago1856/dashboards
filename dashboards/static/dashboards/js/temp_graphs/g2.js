/**
 * IGNORE THIS FILE
 * TO DELETE
 */

import { Canvas } from '../builders/BuildingBlocks.js';

export class G2 extends Canvas {

    constructor(id) {

        super();

        this.setId(id);
        this.setStyle("width","100%");
        this.setStyle("max-height","300px");

        const data = {
        labels: ['Jan','Fev','Mar','Apr','Mai','Jun','Jul'],
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
        };

        const stackedLine = new Chart(this.dom, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    y: {
                        stacked: true
                    }
                }
            }
        });        

    }

}

