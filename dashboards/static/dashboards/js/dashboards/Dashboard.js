
import { Div } from '../builders/BuildingBlocks.js';
import { DashboardTitle } from './DashboardTitle.js';
import { DashboardSubTitle } from './DashboardSubTitle.js';
import { 
    URL_GET_COMPONENT, 
    URL_GET_LAYOUT,
} from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';
import { fetchGET } from "../Fetch.js";
import { COMPONENT_TYPE } from "../Components/ComponentType.js";
import { DEFAULT_DATE_FORMAT } from '../constants.js';
import { CONTAINER_TYPE, CreateComponent } from '../Components/CreateComponent.js';
import { CommsManager } from '../comms/CommsManager.js';

const DASHBOARD_CONTAINER = $('#layout-container');
const MASTER_CONTAINER = $('#master-container');

/**
 * const d = new Dashboard()
 * await d.init()
 */
export class Dashboard extends Div {
    /**
     * Constructor.
     * @param {Context} context Context.
     * @param {number} layout_id Layout ID.
     * @param {object} data Data to restore the layout and all its components.
     * @param {object} components_content Content for each component (query results) --- used to restore a snapshot.
     */
    constructor (context, layout_id, data=null) {
        super();
        this.context = context;
        DASHBOARD_CONTAINER.empty();
        this.attachTo(DASHBOARD_CONTAINER.get(0));
        const self = this;
        //this.data = data?JSON.parse(JSON.stringify(data)):{};        
        this.title = null;
        this.name = data?data.name:null;
        this.description = data?data.description:null;        
        this.id = data?data.id:null;
        this.date_format = data?(data.date_format?data.date_format:DEFAULT_DATE_FORMAT):DEFAULT_DATE_FORMAT;
        this.layout_id = layout_id;
        this.components = {};
        this.changed = false;   // something changed and it's not saved
        this.data = data;
        this.components_content = data?(data.hasOwnProperty('components_content')?data.components_content:null):null;

        MASTER_CONTAINER.removeClass('snapshot-dashboard');

        if (this.components_content) {
            MASTER_CONTAINER.addClass('snapshot-dashboard');
            context.is_snapshot = true;
        } else {
            MASTER_CONTAINER.removeClass('snapshot-dashboard');
            context.is_snapshot = false;
        }

        this.comms = new CommsManager(context);

        this.dash_title = new DashboardTitle(
            context, 
            data?data.title:null,
            (new_title) => {
                this.title = new_title;
            }
        ).attachTo(this); 
        
        if (this.components_content) {
            new DashboardSubTitle(context, data.name).attachTo(this); 
        }
     
        this.onGlobalDateFormatChanged = context.signals.onGlobalDateFormatChanged.add(selected_format => {
            this.date_format = selected_format;
        });

        this.onDashboardSaved = context.signals.onDashboardSaved.add(result => {
            this.id = result.id;
            this.changed = false;
            this.context.signals.onLayoutsChanged.dispatch(this.layout_id);
        })

        this.onComponentRemoved = context.signals.onComponentRemoved.add(component => {
            const spot = component.spot;            
            return CreateComponent(CONTAINER_TYPE.CARD, null, context, spot, null, 'light', null, true).then((comp) => {                    
                $(component.dom).replaceWith($(comp.dom));
                comp.setOptions();
                comp.setEditMode(true);
                this.components[spot] = comp;
            })
        });

        
    }

    /**
     * Setups the dashboard asynchronously.
     * If data => loaded => sets the layout + loads the components + displays the data.
     * No data => new => sets the layouy (components are empty).
     */
     async init() {
        const display = new Div().attachTo(this);
        display.addClass('dashboard-grid');
        const self = this;        
        const grid = await this.getLayout(this.data?this.data.layout:this.layout_id);
        const promises = [];      

        grid.forEach((grid_block, spot) => {
            promises.push( new Promise(resolve => {
                const div = new Div().attachTo(display);
                // check for legacy (old => only components data)
                const component_data = this.data?(this.data.data.hasOwnProperty("components")?this.data.data.components[spot]:this.data.data[spot]):null;
                const component_content = this.components_content ? this.components_content[spot]: null;
                div.addClass("span-col-" + grid_block[0] + (grid_block[1]>1?(" span-row-" + grid_block[1]):""));
                div.setStyle('width','100%');
                if (this.data && (component_data.component_type === 'INFO' || component_data.component_type === 'CONTROL')) {
                    CreateComponent(CONTAINER_TYPE.NONCARD, div, this.context, spot, null, 'light', this.data?component_data:null, false, component_content).then(component => {
                        self.components[component.spot] = component;
                        //self.components[component.spot].attachTo(div);
                        self.components[component.spot].setEditMode(self.context.edit_mode);
                        component.setOptions();
                        resolve();
                    })
                } else {
                    CreateComponent(CONTAINER_TYPE.CARD, div, this.context, spot, null, 'light', this.data?component_data:null, false, component_content).then(component => {
                        self.components[component.spot] = component;
                        //self.components[component.spot].attachTo(div);
                        self.components[component.spot].setEditMode(self.context.edit_mode);
                        component.setOptions();
                        resolve();
                    })
                } 
            }))
        });

        
        await Promise.all(promises);

        if (this.data && this.data.hasOwnProperty('data') && this.data.data.hasOwnProperty('comms')) {
            this.comms.restore(this.data.data.comms);
        } 

    }


    /**
     * Get the component at a specific location in the grid.
     * @param {number} spot Position of the component in the layout grid.
     * @returns Component.
     */
    getComponentAt(spot) {
        return this.components[spot];
    }

    /**
     * Get the component with a specific uuid.
     * @param {string} uuid UUID string.
     * @returns Component.
     */
    getComponent(uuid) {
        for (const key in this.components) {
            if (this.components[key].data.uuid === uuid) return this.components[key];
        }
        return null;
    }
 

    /**
     * Get the dashboard title.
     * @returns The dashboard title.
     */
    getTitle() {
        return this.title;
    }

    /**
     * Sets the dashboard title.
     * If empty or null, then the default title will be set.
     * @param {string} new_title Dashboard title.
     */
    setTitle(new_title) {
        this.dash_title.setTitle(new_title);
    }


    /**
     * Changes the component depending on its type.
     * INFO is different from all others, since it's not inside a card.
     * @param {number} spot Position of the component in the layout grid.
     * @param {boolean} info COMPONENT_TYPE.name (ComponentType.js)
     * @returns Component.
     */
    async changeComponentContainer(spot, info = false) {
        const original = this.getComponentAt(spot);
        const data = JSON.parse(JSON.stringify(original.data));
        let comp = null;
        if (info) {
            comp = await CreateComponent(CONTAINER_TYPE.NONCARD, null, this.context, spot, null, 'light', data);
        } else {
            comp = await CreateComponent(CONTAINER_TYPE.CARD, null, this.context, spot, null, 'light', data);
        }
        original.clear();
        $(original.dom).replaceWith($(comp.dom));
        comp.setOptions();
        comp.setEditMode(true);
        this.components[spot] = comp;
        return this.components[spot];
    }

    /**
     * Loads a component from the database and sets the component.
     * @param {number} spot Spot in the Dashboard.
     * @param {number} component_id Component ID in the database.
     */
    async loadComponent(spot, component_id, new_uuid = false) {
        $("body").css("cursor","progress");        
        return fetchGET(URL_GET_COMPONENT + component_id, 
            (result) => {
                const original = this.getComponentAt(spot);
                const data = JSON.parse(JSON.stringify(result.data));
                data.id = result.id;
                let type = CONTAINER_TYPE.CARD;
                if (data.component_type === COMPONENT_TYPE.INFO.name || 
                    data.component_type === COMPONENT_TYPE.CONTROL.name) {
                        type = CONTAINER_TYPE.NONCARD;                
                }
                return CreateComponent(type, null, this.context, spot, null, 'light', data, new_uuid).then((comp) => {                    
                    original.clear();
                    $(original.dom).replaceWith($(comp.dom));
                    comp.setOptions();
                    comp.setEditMode(true);
                    this.components[spot] = comp;
                    $("body").css("cursor","auto");
                })
            },
            (error) => {
                $("body").css("cursor","auto");
                const error_codes = getAllNumbers(error.toString());
                if (error_codes && error_codes.length > 0 && error_codes[0] == 500)
                    this.context.signals.onError.dispatch("Problemas com a base de dados! Verifique se existe!","[EditComponentModal::fetchQueries]");
                else
                    this.context.signals.onError.dispatch(error,"[main::onLoadComponent]");
                
            }
        );
    }

    /**
     * Something in the dashboard changed.
     */
    changed() {
        this.changed = true;
      }
  
    /**
     * Get all the required data to recreate the dashboard, except the query's
     * results. For that, use getFullData().
     * Used to save the dashboard.
     * @returns All the required data to recreate the dashboard.
     */
     getData() {
        const components_data = {}
        for (const spot in this.components){
            components_data[spot] = this.components[spot].data;
        }
        return {
            name: this.name,
            description: this.description,
            title: this.title,
            layout_id: this.layout_id,
            components_data: components_data,
            id: this.id,
            date_format: this.date_format,
            comms: this.comms.getData(),
        }
    };

    /**
     * Get all the required data to recreate the dashboard including the query's
     * results, controls values, ...
     * Used when taking a dashboard's snapshot.
     * @returns All the required data to recreate the dashboard, including the query's
     * results.
     */
    getFullData() {
        const data = this.getData();
        const components_content = {}
        for (const spot in this.components){            
            components_content[spot] = this.components[spot].content ? this.components[spot].content.getContents(): null;
        }
        data['components_content'] = components_content;
        return data;
    }


    /**
     * Loads a layout data from the database.
     * @param {number} layout_id Layout ID.
     */
    async getLayout(layout_id) {
        $("body").css("cursor","progress");        
        return fetchGET(URL_GET_LAYOUT + layout_id, 
            (result) => {
                $("body").css("cursor","auto");
                //if (onReady) onReady(result.data);
                return result.data;
            },
            (error) => {
                $("body").css("cursor","auto");
                const error_codes = getAllNumbers(error.toString());
                if (error_codes && error_codes.length > 0 && error_codes[0] == 404) {
                    //this.context.signals.onError.dispatch("Layout [" + layout_id + "] não existe!","[Dashboard::getLayout]");
                    this.context.signals.onError.dispatch("Não existem Layouts válidos!","[Dashboard::getLayout]");
                } else {
                    this.context.signals.onError.dispatch(error,"[Dashboard::getLayout]");
                }
                
            }
        );
    }

    clear() {
        this.onGlobalDateFormatChanged.detach();
        this.onDashboardSaved.detach();
        this.onComponentRemoved.detach();

        for (const key in this.components) {
            if (this.components[key].content) {
                this.components[key].clear();
                this.components[key].content.clear();
            }
        }

        this.comms.clear();
        this.comms = null;
    }




}
