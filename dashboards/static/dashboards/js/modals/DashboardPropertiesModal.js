
import { fetchPOST } from "../Fetch.js";
import { 
    URL_CHECK_NAME_DASHBOARD
} from "../urls.js";

const DASH_PROPERTIES_MODAL = $("#dashboard-properties-modal");
const DASH_PROPERTIES_NAME = $("#dpm-dashboard-name");
const DASH_PROPERTIES_DESCRIPTION = $("#dpm-dashboard-description");
const DASH_PROPERTIES_TITLE = $("#dpm-dashboard-title");
const DASH_PROPERTIES_SAVE_BTN = $("#dpm-save-btn");
const DASH_PROPERTIES_ALERT = $("#dpm-name-alert");


export function DashboardPropertiesModal(context) {
    this.context = context;
    this.dash = null;
    const self = this;

    DASH_PROPERTIES_TITLE.on('change blur paste keyup', function(e) {
        self.dash.setTitle(e.target.value);
    })

    DASH_PROPERTIES_SAVE_BTN.on('click', function() {
        self.save();
    });

    DASH_PROPERTIES_NAME.on('change focus keyup paste', function(e) {
        if (e.target.value === '') {
            DASH_PROPERTIES_NAME.addClass('invalid-input');
            DASH_PROPERTIES_NAME.removeClass('valid-input ');            
        } else {
            DASH_PROPERTIES_NAME.removeClass('invalid-input');
            DASH_PROPERTIES_NAME.addClass('valid-input');
        }
        self.checkName();
    });    
}


DashboardPropertiesModal.prototype = {
    show: function(dash = null, onReady = null) {
        this.dash = dash;
        this.onReady = onReady;
        DASH_PROPERTIES_TITLE.val(dash.getTitle());
        DASH_PROPERTIES_ALERT.hide();
        const name = dash.name;
        if (name && name !== '') {
            DASH_PROPERTIES_NAME.val(name);
        } else {
            DASH_PROPERTIES_NAME.val(uuidv4());
        }
        DASH_PROPERTIES_MODAL.modal('show');
        this.checkName();
    },

    save: function() {
        this.dash.name = DASH_PROPERTIES_NAME.val();
        this.dash.description = DASH_PROPERTIES_DESCRIPTION.val();
        this.dash.save(            
            (result) => {
                DASH_PROPERTIES_MODAL.modal('hide');
                if (this.onReady) this.onReady(this.result);
            }
        );
    },

    /**
     * Checks if name exists,
     * if so, show error message
     */
     checkName: function() {
        fetchPOST(
            URL_CHECK_NAME_DASHBOARD, 
            {
                id: this.dash.id,
                name: DASH_PROPERTIES_NAME.val(),
            }, 
            result => {
                if (result.status == 200) {
                    DASH_PROPERTIES_ALERT.hide();
                    DASH_PROPERTIES_SAVE_BTN.prop('disabled',false);
                } else {
                    DASH_PROPERTIES_ALERT.show();
                    DASH_PROPERTIES_SAVE_BTN.prop('disabled',true); 
                }
            },
            (error) => {
                    this.context.signals.onError.dispatch(error,"[DashboardPropertiesModal::checkName]");                
            }
        )
    },    

}
