
import { Div, Hx, Text, I } from '../../builders/BuildingBlocks.js';


export class InfoSimpleRight extends Div {
  constructor(context, data, parent, opt_btn) {
      super(context, data, parent);

      this.addClass("small-box bg-danger  info-component-content");
      this.attachTo(parent);
      this.setStyle('height','100%');
      const inner = new Div().attachTo(this);
      inner.addClass('inner');
      const value = new Hx(3).attachTo(inner);
      value.setTextContent('VALUE');
      const text = new Text('TEXT').attachTo(inner);

      const icon_div = new Div().attachTo(this);
      icon_div.addClass('icon');
      const icon = new I().attachTo(icon_div);
      icon.addClass("icon ion-md-alert");


      
    }
}

/*
		<div class="small-box bg-danger">
            <div class="inner">
              <h3>150</h3>
              <p>New Orders</p>
            </div>
            <div class="icon">
				<i class="icon ion-md-heart"></i>
            </div>
          </div>
        </div>
*/