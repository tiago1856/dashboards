
import { Div } from '../builders/BuildingBlocks.js';
import { CardComponent } from '../Components/CardComponent.js';
import { DashboardTitle } from './DashboardTitle.js';
import { NonCardComponent } from '../components/NonCardComponent.js';
import { 
    URL_GET_COMPONENT, 
    URL_SAVE_DASHBOARD, 
    URL_GET_LAYOUT,
} from "../urls.js";
import { getAllNumbers } from '../utils/jsutils.js';
import { fetchGET, fetchPOST } from "../Fetch.js";
import { COMPONENT_TYPE } from "../Components/ComponentType.js";
import { DEFAULT_DATE_FORMAT } from '../constants.js';
import { CONTAINER_TYPE, CreateComponent } from '../Components/CreateComponent.js';

const DASHBOARD_CONTAINER = $('#layout-container');

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
     * @param {function} onReady Called when dashboard created and ready - the layout, not the components rendering.
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
        this.date_format = data?data.date_format:DEFAULT_DATE_FORMAT;        
        this.layout_id = layout_id;
        this.components = {};
        this.changed = false;   // something changed and it's not saved
        this.data = data;

        this.dash_title = new DashboardTitle(
            context, 
            data?data.title:null,
            (new_title) => {
                this.title = new_title;
            }
        ).attachTo(this);        
     
        context.signals.onGlobalDateFormatChanged.add(selected_format => {
            this.date_format = selected_format;
        });

        context.signals.onDashboardSaved.add(result => {
            this.id = result.id;
            this.changed = false;
            this.context.signals.onLayoutsChanged.dispatch(this.layout_id);
        })   
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

        await grid.forEach(async (grid_block, spot) => {
            const div = new Div().attachTo(display);
            div.addClass("span-col-" + grid_block[0] + (grid_block[1]>1?(" span-row-" + grid_block[1]):""));
            div.setStyle('width','100%');
            if (this.data && (this.data.data[spot].component_type === 'INFO' || this.data.data[spot].component_type === 'CONTROL')) {
                return CreateComponent(CONTAINER_TYPE.NONCARD, this.context, spot, null, 'light', this.data?this.data.data[spot]:null).then(component => {
                    self.components[component.spot] = component;
                    self.components[component.spot].attachTo(div);
                    self.components[component.spot].setEditMode(self.context.edit_mode);
                })
            } else {
                return CreateComponent(CONTAINER_TYPE.CARD, this.context, spot, null, 'light', this.data?this.data.data[spot]:null).then(component => {
                    self.components[component.spot] = component;
                    self.components[component.spot].attachTo(div);
                    self.components[component.spot].setEditMode(self.context.edit_mode);
                })
            } 
        });
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
            comp = await CreateComponent(CONTAINER_TYPE.NONCARD, this.context, spot, null, 'light', data);
        } else {
            comp = await CreateComponent(CONTAINER_TYPE.CARD, this.context, spot, null, 'light', data);
        }
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
    async loadComponent(spot, component_id) {
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
                return CreateComponent(type, this.context, spot, null, 'light', data).then((comp) => {
                    $(original.dom).replaceWith($(comp.dom));
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
     * Saves the dashboard in the database.
     * @param {function} onReady Called when done.
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
        }
    };


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


}



    /*
    async init() {
        const display = new Div().attachTo(this);
        display.addClass('dashboard-grid');
        let spot = 0;
        const self = this;        
        const grid = await this.getLayout(this.data?this.data.layout:this.layout_id);

        await [...Array(grid.length)].reduce( (p, _, i) => 
        p.then(
            () => {
                const div = new Div().attachTo(display);
                div.addClass("span-col-" + grid[spot][0] + (grid[spot][1]>1?(" span-row-" + grid[spot][1]):""));
                div.setStyle('width','100%');
                if (this.data && (this.data.data[spot].component_type === 'INFO' || this.data.data[spot].component_type === 'CONTROL')) {
                    //this.components[spot] = new NonCardComponent(this.context, spot, null, 'light', data?data.data[spot]:null).attachTo(div);
                    return CreateComponent(CONTAINER_TYPE.NONCARD, this.context, spot, null, 'light', this.data?this.data.data[spot]:null).then(component => {
                        self.components[spot] = component;
                        self.components[spot].attachTo(div);
                        self.components[spot].setEditMode(self.context.edit_mode);
                        spot++;
                    })
                } else {
                    //this.components[spot] = new CardComponent(this.context, spot, null, 'light', data?data.data[spot]:null).attachTo(div);
                    return CreateComponent(CONTAINER_TYPE.CARD, this.context, spot, null, 'light', this.data?this.data.data[spot]:null).then(component => {
                        self.components[spot] = component;
                        self.components[spot].attachTo(div);
                        self.components[spot].setEditMode(self.context.edit_mode);
                        spot++;
                    })
                }                   
                
            })
        , Promise.resolve()); 
    }

    */