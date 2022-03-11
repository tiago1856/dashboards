

import { Div } from '../builders/BuildingBlocks.js';

/**
 * Simple card container with body and nothing else
 */
export class SimpleCard extends Div {
  /**
   * Constructor.
   */
    constructor() {
        super();
        this.addClass('SimpleCard');
        this.addClass('card');

        this.body = new Div().attachTo(this);
        this.body.addClass('card-body pb-3');
        //this.body.setId(uuidv4());
    }

    /**
     * Get the body.
     * @returns The body.
     */
    getBody() {
        return this.body;
    }
}