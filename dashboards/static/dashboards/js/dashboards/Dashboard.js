
import { Div } from '../builders/BuildingBlocks.js';
import { Component } from '../components/Component.js';
import { DashboardTitle } from './DashboardTitle.js';
import { InfoComponent } from '../components/InfoComponent.js';
import { 
    URL_GET_COMPONENT, 
    URL_SAVE_DASHBOARD, 
    URL_GET_LAYOUT 
} from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';
import { fetchGET, fetchPOST } from "../Fetch.js";
import { COMPONENT_TYPE } from "../Components/ComponentType.js";


const DASHBOARD_CONTAINER = $('#layout-container');

export class Dashboard extends Div {
    /**
     * Constructor.
     * @param {Context} context Context.
     * @param {number} layout_id Layout ID.
     * @param {object} data Data to restore the layout and all its components.
     * @param {boolean} edit_mode Component in edit mode?
     */
    constructor (context, layout_id, data=null, edit_mode = false) {
        super();
        this.context = context;
        DASHBOARD_CONTAINER.empty();
        this.attachTo(DASHBOARD_CONTAINER.get(0));

        this.title = null;
        this.name = null;
        this.description = null;
        this.components = {};
        this.id = null;
        this.layout_id = layout_id;

        this.dash_title = new DashboardTitle(
            context, 
            data?data.title:null,
            (new_title) => {
                this.title = new_title;
            }
        ).attachTo(this);
        
        const display = new Div().attachTo(this);
        display.addClass('dashboard-grid');

        let spot = 0

        this.getLayout(data?data.layout:layout_id, (grid) => {
            //const l = [[4,1],[4,1],[4,1],[6,1],[6,2],[6,1]];
            grid.forEach(dims => {
                const div = new Div().attachTo(display);
                div.addClass("span-col-" + dims[0] + (dims[1]>1?(" span-row-" + dims[1]):""));
                div.setStyle('width','100%');
                this.components[spot] = new Component(this.context, spot, null, 'light', data?data.data[spot]:null).attachTo(div);
                this.components[spot].setEditMode(edit_mode);
                spot++;    
            })
        })
               
    }

    getComponentAt(spot) {
        return this.components[spot];
    }

    getTitle() {
        return this.title;
    }

    setTitle(new_title) {
        this.dash_title.setTitle(new_title);
    }


    changeComponentContainer(spot, info = false) {
        const original = this.getComponentAt(spot);
        const data = JSON.parse(JSON.stringify(original.data));
        let comp = null;
        if (info)
            comp = new InfoComponent(this.context, spot, null, 'light', data);
        else
            comp = new Component(this.context, spot, null, 'light', data);
        $(original.dom).replaceWith($(comp.dom));
        comp.setEditMode(true);
        this.components[spot] = comp;
        return this.components[spot];
    }

    /**
     * Loads a component from the database and sets the component.
     * @param {number} spot Spot in the Dashboard.
     * @param {number} component_id Component ID in the database.
     */
    loadComponent(spot, component_id) {
        $("body").css("cursor","progress");        
        fetchGET(URL_GET_COMPONENT + component_id, 
            (result) => {
                const original = this.getComponentAt(spot);
                const data = JSON.parse(JSON.stringify(result.data));
                data.id = result.id;
                let comp = null;
                if (data.component_type === COMPONENT_TYPE.INFO.name) {
                    comp = new InfoComponent(this.context, spot, null, 'light', data);
                } else {
                    comp = new Component(this.context, spot, null, 'light', data);
                }
                $(original.dom).replaceWith($(comp.dom));
                comp.setEditMode(true);
                this.components[spot] = comp;
                $("body").css("cursor","auto");
            },
            (error) => {
                $("body").css("cursor","auto");
                if (getAllNumbers(error.toString())[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados! Verifique se existe!","[EditComponentModal::fetchQueries]");
                else
                    this.context.signals.onError.dispatch(error,"[main::onLoadComponent]");
                
            }
        );
    }

    /**
     * Save layout in the database.
     * @param {function} onReady Called when done.
     */
    save(onReady = null) {
        const data = {}
        for (const spot in this.components){
            data[spot] = this.components[spot].data;
        }
        $("body").css("cursor","progress");
        fetchPOST(
            URL_SAVE_DASHBOARD, 
            {
                name: this.name,
                description: this.description,
                title: this.title,
                layout: this.layout_id,
                data: data,
            }, 
            result => {
                $("body").css("cursor","auto");
                this.id = result.id;
                this.context.signals.onLayoutsChanged.dispatch(this.layout_id);
                if (onReady) onReady(result);
            },
            (error) => {
                $("body").css("cursor","auto");
                this.context.signals.onError.dispatch(error,"[Dashboard::save]");                
            }
        )
    }

    /**
     * Loads a layout data from the database.
     * @param {number} layout_id Layout ID.
     * @param {function} onReady CAlled when done.
     */
    getLayout(layout_id, onReady = null) {
        $("body").css("cursor","progress");        
        fetchGET(URL_GET_LAYOUT + layout_id, 
            (result) => {
                $("body").css("cursor","auto");
                if (onReady) onReady(result.data);
            },
            (error) => {
                $("body").css("cursor","auto");
                if (getAllNumbers(error.toString())[0] == 404)
                    this.context.signals.onError.dispatch("Layout [" + layout_id + "] não existe!","[Dashboard::getLayout]");
                else
                    this.context.signals.onError.dispatch(error,"[Dashboard::getLayout]");
                
            }
        );
    }


}

