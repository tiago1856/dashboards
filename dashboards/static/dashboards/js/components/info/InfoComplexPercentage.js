
import { Div } from '../../builders/BuildingBlocks.js';


export class InfoComplexPercentage extends Div {
  constructor(context, component) {
    super(context, component);

    this.addClass("small-box bg-danger info-component-content");
    this.attachTo(component.body);
    this.setStyle('height','100%');
    }
}

/*
        <div class="info-box bg-danger">
            <span class="info-box-icon bg-warning"><i class="icon ion-md-heart"></i></span>

            <div class="info-box-content">
              <span class="info-box-text">Direct Messages</span>
              <span class="info-box-number">163,921</span>

              <div class="progress">
                <div class="progress-bar" style="width: 40%"></div>
              </div>
              <span class="progress-description">
                    40% Increase in 30 Days
                  </span>
            </div>
            <!-- /.info-box-content -->
          </div>
*/