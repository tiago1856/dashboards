
import { Div } from '../builders/BuildingBlocks.js';
import { Component } from '../components/Component.js';
import { LAYOUTS } from '../constants.js';
import { DashboardTitle } from './DashboardTitle.js';
import { InfoComponent } from '../components/InfoComponent.js';
import { URL_GET_COMPONENT, URL_SAVE_DASHBOARD } from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';
import { fetchGET, fetchPOST } from "../Fetch.js";
import { COMPONENT_TYPE } from "../Components/ComponentType.js";


const DASHBOARD_CONTAINER = $('#layout-container');
/*
                {
                    "id": 3,
                    "name": "d2a3c523-4c08-4f34-856b-7024ac4f0844",
                    "description": "",
                    "layout": 2,
                    "layout_name": "L2",
                    "title": null,
                    "data": {
                      "0": {
                        "id": null,
                        "name": null,
                        "description": null,
                        "title": null,
                        "component_type": null,
                        "query": {
                          "query_selection": null,
                          "query": null,
                          "query_selected_fields": null,
                          "query_fields": null
                        },
                        "visualization": {
                          "visualization_type": null,
                          "visualization_tab": null
                        },
                        "data_config": {}
                      },
                      "1": {
                        "id": null,
                        "name": null,
                        "description": null,
                        "title": null,
                        "component_type": null,
                        "query": {
                          "query_selection": null,
                          "query": null,
                          "query_selected_fields": null,
                          "query_fields": null
                        },
                        "visualization": {
                          "visualization_type": null,
                          "visualization_tab": null
                        },
                        "data_config": {}
                      }
                    }
                  }                
*/

export class Dashboard extends Div {
    /**
     * 
     * @param {Context} context Context.
     * @param {string} layout_id Layout ID (check constants.js).
     * @param {object} data Data to restore the layout and all its components.
     */
    constructor (context, layout_id, data=null) {
        super();
        this.context = context;
        DASHBOARD_CONTAINER.empty();
        this.attachTo(DASHBOARD_CONTAINER.get(0));

        //context.layout = {title: null, components: {}};
        this.title = null;
        this.name = null;
        this.description = null;
        this.components = {};
        this.id = null;
        this.layout_id = layout_id;

        const rows = LAYOUTS[layout_id];

        this.dash_title = new DashboardTitle(
            context, 
            data?data.title:null,
            (new_title) => {
                this.title = new_title;
            }
        ).attachTo(this);
        

        let spot = 0

        rows.forEach(row => {
            //this.parse(_row, COMPONENTS_CONTAINER);
            // check if there is a multi-row component and if so, it must have max-height
            let h100 = false;
            for (let i=0; i<row.length; i++){
                if (row[i][1] > 1) {
                    h100 = true;
                    break;
                }
            };
                        
            const new_row = new Div({classes:['row']}).attachTo(this);
            row.forEach(col => {

                const _col = new Div({classes:['col-md-' + col[0], 'mb-2']});
                _col.attachTo(new_row);
                if (col[1] === 1 && h100) {
                    this.components[spot] = new Component(this.context, spot, null, true, 'primary').attachTo(_col);
                    spot++;
                } else {
                    for (let i=0; i < col[1]; i++) {                        
                        this.components[spot] = new Component(this.context, spot, null, false, 'light').attachTo(_col);
                        spot++;
                    }
                }

            });

        });       
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
        const h100 = this.components[spot].h100;
        if (info)
            comp = new InfoComponent(this.context, spot, null, h100, 'light', data);
        else
            comp = new Component(this.context, spot, null, h100, 'light', data);
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
                let comp = null;
                const h100 = this.components[spot].h100;
                if (data.component_type === COMPONENT_TYPE.INFO) {
                    comp = new InfoComponent(this.context, spot, null, h100, 'light', data);
                } else {
                    comp = new Component(this.context, spot, null, h100, 'light', data);
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

    save(onReady = null) {
        const data = {}
        for (const spot in this.components){
            data[spot] = this.components[spot].data;
        }

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
                console.log(">>>>>> ", result);
                this.id = result.id;
                if (onReady) onReady(result);
            },
            (error) => {
                    this.context.signals.onError.dispatch(error,"[EditComponentModal::saveComponent]");                
            }
        )
    }

    restore(data) {

    }


}


