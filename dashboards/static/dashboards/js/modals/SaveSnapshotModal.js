
import { fetchPOST } from "../Fetch.js";
import { 
    URL_CHECK_NAME_SNAPSHOT
} from "../urls.js";
import { now } from '../utils/jstime.js';


const SNAPSHOT_MODAL = $("#snapshot-save-modal");
const SNAPSHOT_NAME = $("#ssm-snapshot-name");
const SNAPSHOT_DESCRIPTION = $("#ssm-snapshot-description");
const SNAPSHOT_SAVE_BTN = $("#ssm-save-btn");
const SNAPSHOT_ALERT = $("#ssm-name-alert");


export function SaveSnapshotModal(context) {
    this.context = context;
    this.save_callback = null;
    const self = this;

    SNAPSHOT_SAVE_BTN.on('click', function() {
        self.save();
    });

    SNAPSHOT_NAME.on('change focus keyup paste', function(e) {
        if (e.target.value === '') {
            SNAPSHOT_NAME.addClass('invalid-input');
            SNAPSHOT_NAME.removeClass('valid-input ');            
        } else {
            SNAPSHOT_NAME.removeClass('invalid-input');
            SNAPSHOT_NAME.addClass('valid-input');
        }
        self.checkName();
    });    
}


SaveSnapshotModal.prototype = {
    show: function(save_callback = null) {
        this.save_callback = save_callback;
        SNAPSHOT_ALERT.hide();
        const name = "snapshot " + now();
        SNAPSHOT_NAME.val(name);
        SNAPSHOT_MODAL.modal('show');
        this.checkName();
    },

    save: function() {
        if (this.save_callback) this.save_callback(SNAPSHOT_NAME.val(), SNAPSHOT_DESCRIPTION.val());
        SNAPSHOT_MODAL.modal('hide');
    },

    /**
     * Checks if name exists,
     * if so, shows error message
     */
     checkName: function() {
        fetchPOST(
            URL_CHECK_NAME_SNAPSHOT, 
            {
                name: SNAPSHOT_NAME.val(),
            }, 
            result => {
                if (result.status == 200) {
                    SNAPSHOT_ALERT.hide();
                    SNAPSHOT_SAVE_BTN.prop('disabled',false);
                } else {
                    SNAPSHOT_ALERT.show();
                    SNAPSHOT_SAVE_BTN.prop('disabled',true); 
                }
            },
            (error) => {
                    this.context.signals.onError.dispatch(error,"[SaveSnapshotModal::checkName]");                
            }
        )
    },    

}
