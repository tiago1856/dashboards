
import { equalsOrderedArrays, subStr } from '../utils/jsutils.js';
import { Div, Span } from "../builders/BuildingBlocks.js";


const COMM_DIAGRAM_CONTAINER = 'comm-diagram';
const COMP_LIST = $("#comm-components-list");
const COMP_DIAGRAM = $("#comm-diagram");
const SIZE_PER_IO = 48;



export class CommsManager {

    constructor (context) {
        
        this.context = context;
        this.ios = {};	// uuid: {inputs, outputs, name, indices: {inputs, outputs}}; - indices: ordered arrays with the uuid of each endpoint
        //connection_id: source(from): {component, pin, index}, target(target): {component, pin, index}
        this.links = {};
        const self = this;

        this.instance = jsPlumb.getInstance();
        this.instance.setContainer(COMM_DIAGRAM_CONTAINER);
        
        this.instance.bind("ready", function() {
            self.instance.bind('contextmenu',function(component, event) {
                if (component.connector.canvas.classList.contains('jsplumb-connector')) {
                    event.preventDefault();
                    window.selectedConnection = component;
                    $('<div class="comm-custom-menu"><button class="delete-connection btn btn-danger">Remover ligação</button></div>')
                    .appendTo('body')
                    .css({top: event.pageY + 'px', left: event.pageX + 'px'});
                }
            });
        });

            // on drop
            COMP_DIAGRAM.droppable({
                drop: function(event, ui) {
                    //var id= uuidv4();
                    var id= $(ui.helper).attr('data-uuid');
                    var clone = $(ui.helper).clone(true);
                    clone.attr("id",id);
                    clone.appendTo(this);
                    
                    // get the coordinates of the drop
                    const rect = COMP_DIAGRAM.get(0).getBoundingClientRect();
                    const _top_drop = ui.position.top - rect.top;
                    const _top_left = ui.position.left - rect.left;
                    clone.css('top', _top_drop);
                    clone.css('left', _top_left);
                    
                    self.instance.draggable(id, {
                        containment: true,
                        scroll: true,
                    } );
                    self.removeComponentFromList( ui.draggable );
                    self.setupComponent(clone);
                    context.signals.onChanged.dispatch();
                }
            });
            
            // on remove connection through menu
            $('body').on('click','.delete-connection',function(event) {
                self.instance.detach(window.selectedConnection);
                $('div.comm-custom-menu').remove();
                context.signals.onChanged.dispatch();
            });


            // show remove component menu
            $('body').on('contextmenu','#comm-diagram .comm-component', function(event) {
                event.preventDefault();
                window.selectedControl = $(this).attr('id');
                $('<div class="comm-custom-menu"><button class="delete-control btn btn-danger">Remover componente</button></div>')
                .appendTo('body')
                .css({top: event.pageY + 'px', left: event.pageX + 'px'});
            });
            
            // on remove component through menu
            $('body').on('click','.delete-control',function(event) {
                console.warn(window.selectedControl);
                const restore = self.ios[window.selectedControl];
                self.removeComponentFromDiagram(window.selectedControl);
                $('div.comm-custom-menu').remove();
                self.createComponent(restore.name, window.selectedControl, restore.inputs, restore.outputs);
                context.signals.onChanged.dispatch();
            });
            
            // remove custom menu
            $('body').on('click', function(event) {
                $('div.comm-custom-menu').remove();
            });
            
            // on conection:
            self.instance.bind('connection',function(info,ev){
                const con=info.connection;   //this is the new connection
                const connection_id = info.connection.id; 
                const source_pin_uuid = con.endpoints[0].getUuid();
                const target_pin_uuid = con.endpoints[1].getUuid();
                const source_pin_index = self.ios[info.sourceId].indices.outputs.indexOf(source_pin_uuid);
                const target_pin_index = self.ios[info.targetId].indices.inputs.indexOf(target_pin_uuid);
                const source_pin_name = self.ios[info.sourceId].outputs[source_pin_index];
                const target_pin_name = self.ios[info.targetId].inputs[target_pin_index];
                const conn_data = {
                    source: {
                        component:info.sourceId, 
                        pin: source_pin_name,
                        index: source_pin_index,
                    }, 
                    target: {
                        component:info.targetId, 
                        pin: target_pin_name, 
                        index: target_pin_index,
                    }
                };
                self.links[connection_id] = conn_data;
                console.log(self.links);
                context.signals.onChanged.dispatch();
            });
            
            // on desconnection
            // it's also called when an entire componenent is removed
            self.instance.bind("connectionDetached", function(info, ev) {
                //const con = info.connection;
                const connection_id = info.connection.id;  
                delete self.links[connection_id];
                context.signals.onChanged.dispatch();
            });
    



        context.signals.onComponentNameChanged.add((uuid, old_name, new_name) => {
            if (this.ios.hasOwnProperty(uuid)) {   
                //this.ios[uuid].name = new_name;
                this.changeComponentName(uuid, new_name)
                context.signals.onChanged.dispatch();
            }            
        });

        // component was updated, either the query structure or some other thing
        //context.signals.onComponentUpdated.add((component_uuid, update_comms = true) => {
            context.signals.onComponentUpdated.add((component, update_comms = true) => {
            if (update_comms) {
                this.updateComponentComms(component);
            }
        });


        context.signals.onCommTriggered.add((uuid, new_values) => {
            //console.log(uuid, new_values);

            const data_comm = {};

            new_values.forEach(data => {
                for(const key in this.links) {
                    const link = this.links[key];
                    if (link.source.component === uuid && link.source.index == data.index) {
                        //if (link_data.to.component && link_data.to.component !== 'undefined') {
                        if (!data_comm.hasOwnProperty(link.target.component)) {
                            data_comm[link.target.component] = [];
                        }
                        data_comm[link.target.component].push({pin: link.target.pin, value: data.value, index: link.target.index});
                    }
                }
            })

            for (const key in data_comm) {
                console.warn("send > ", key, data_comm[key]);
                context.signals.onQueryUpdated.dispatch(key, data_comm[key]);            
            }
        });
    }


    removeComponentFromList = ( $item ) => {
        $item.remove();
    }
  
    removeComponentFromDiagram = (uuid) => {
        this.instance.detachAllConnections(uuid);
        this.instance.removeAllEndpoints(uuid);
        this.instance.detach(uuid);        
        //$('#' + uuid).remove();
        this.instance.remove(uuid);
    }


    // inputs => in pins | outputs => out pins
    createComponent = (name, uuid=null, inputs=[], outputs=[], parent = COMP_LIST.get(0), in_diagram=false, top=0, left=0) => {
        if (!uuid) {
            console.error("[CommsManager::createComponent] Invalid uuid | Name:", name);
            return null;
        }
        const component = new Div().attachTo(parent);
        if (in_diagram) {
            component.setAttribute('id',uuid);
            component.setStyle('top',top + 'px');
            component.setStyle('left',left + 'px');
        }
        component.addClass('comm-component');
        const title = new Span().attachTo(component);		
        title.addClass('comm-diagram-component-name');
        title.setTextContent(subStr(name,16,16));
        if (uuid) component.setAttribute('data-uuid',uuid);
        const i = inputs.length;
        const o = outputs.length;
        let size = 1;
        if (i > o) {
            size = i;
        } else {
            size = o;
        }
        component.setStyle('height', (size * SIZE_PER_IO + 32) + 'px');
        this.ios[uuid] = {inputs: inputs, outputs: outputs, name: name, /*uuids: {},*/ indices: {inputs:[], outputs:[]}};
        
        if (in_diagram) {
            this.instance.draggable(uuid, {
                containment: true,
                scroll: true,
            } );
        } else {
            $(component.dom).draggable({
                helper: "clone",
                containment: "body",
                //appendTo: "#comm-diagram",
                appendTo: "body",	// otherwise the overflow affects the helper's visibility
                scroll: true,
            });
        }
        return component
    }

    // set the pins and labels
    setupComponent = (component) => {
        const uuid = component.attr('data-uuid');
        if (!this.ios.hasOwnProperty(uuid)) return;
        const {inputs, outputs, name} = this.ios[uuid]
        const n_in = inputs.length;
        const n_out = outputs.length;
        
        
        let delta = 1/(n_out + 1);
        outputs.forEach((output, index) => {
            const pin_uuid = uuidv4();	// GET FROM DATA
            this.instance.addEndpoint(component.attr('id'), {
                endpoint: "Dot",
                anchor: [ 1, delta + delta * index, 1, 0],
                isSource: true,
                maxConnections: -1,
                uuid:pin_uuid,
                connectorStyle:{lineWidth:5,strokeStyle:"red"},
                connectorHoverStyle:{lineWidth:10,strokeStyle:"red"},
                overlays:[
                    [ "Label", { label:subStr(output,16,16), id:'label', location:[0, 1.1 + delta + delta * index - 0.05 * index] } ]
                ],
            });	
            //io[uuid].uuids[pin_uuid] = output;
            this.ios[uuid].indices.outputs.push(pin_uuid);
            
        });	
        
        
        delta = 1/(n_in + 1);
        inputs.forEach((input, index) => {
            const pin_uuid = uuidv4();
            this.instance.addEndpoint(component.attr('id'), {
                endpoint: "Rectangle",
                anchor: [ 0, delta + delta * index, -1, 0],
                isTarget: true,
                maxConnections: -1,
                uuid:pin_uuid,
                connectorStyle:{lineWidth:5,strokeStyle:"red"},
                connectorHoverStyle:{lineWidth:10,strokeStyle:"red"},
                overlays:[
                    [ "Label", { label:subStr(input,16,16), id:'label', location:[0, 1.1 + delta + delta * index - 0.05 * index] } ]
                ],
            });	
            //io[uuid].uuids[pin_uuid] = input;
            this.ios[uuid].indices.inputs.push(pin_uuid);
            
        }); 
    }

    // deletes a component and its connections
    deleteComponent = (uuid = null) => {
        if (!uuid) {
            console.error("[CommsManager::deleteComponent] Invalid uuid!");
            return null;
        };


        const ele = COMP_DIAGRAM.find(`[data-uuid='${uuid}']`);
        if (ele.length > 0) {
            // remove from diagram - component and connections
            this.removeComponentFromDiagram(uuid);
        } else {
            // remove from list
            COMP_LIST.find(`[data-uuid='${uuid}']`).remove();
        }
        
        
        // remove from collections - io
        delete this.ios[uuid];	
    }

    changeComponentName = (uuid = null, new_name = null) => {
        if (!uuid) {
            console.error("[CommsManager::changeComponentName] Invalid uuid!");
            return null;
        }	
        if (!new_name || new_name === '') return;
        
        this.ios[uuid].name = new_name;
        
        const comp = COMP_LIST.find(`[data-uuid='${uuid}'] > span:first`);
        if (comp.length > 0) {
            comp.text(subStr(new_name,16,16));
        } else {
            COMP_DIAGRAM.find("#" + uuid + " > span:first").text(subStr(new_name,16,16));	
        }        
    }

  
    moveComponent2Diagram = (uuid = null, top = 0, left = 0) => {
        if (!uuid) {
           console.error("[CommsManager::moveComponent2Diagram] Invalid uuid!");
           return;
       }       
        const comp_2_move = COMP_LIST.find(`[data-uuid='${uuid}']`);
        const component = comp_2_move.clone(false);
        component.attr("id",uuid);
        component.css('top', top + "px");
        component.css('left', left + "px");
        component.appendTo(COMP_DIAGRAM);
        this.instance.draggable(uuid, {containment: true, scroll: true} );
        this.removeComponentFromList( comp_2_move );
        this.setupComponent(component);	
    }




    /**
     * Resets all comms.
     */
    reset = () => {
        this.ios = {};	
        this.links = {};
        COMP_LIST.empty();
        COMP_DIAGRAM.empty();
        //this.instance.reset();
        console.warn("RESET");
    }

    /**
     * Creates a data structure containing all data related with the comms.
     * @returns Data to save.
     */

    // not in diagram = in_diagram / io
    getData = () => {
        const data = {};
        data["io"] = this.ios;
        data["links"] = this.links;
        data["in_diagram"] = {};	
        COMP_DIAGRAM.find('div.comm-component').each(function(index, value) {
            data["in_diagram"][$(this).attr('data-uuid')] = {top: parseFloat($(this).css('top')), left: parseFloat($(this).css('left'))};
        });	
        return data;
    }


    /**
     * Restores the comms.
     * @param {object} data Dashboard data to restore the comms.
     */
    restore = (data=null) => {
        if (!data) {
            console.warn("[CommsManager::restore] No comms data to restore!");
            return null;
        }

        console.warn("comms data >", data);
        

        for (const uuid in data.in_diagram) {
            const component = data.in_diagram[uuid];
            const top = component.top;
            const left = component.left;
            console.log(">>>>", uuid, top, left);
        }
       // this.ios = data.io;	
       // this.links = data.links;
    }

    /**
     * Updates the comms accordindly with the updated component.
     * @param {string} component_uuid Component's uuid.
     */
     updateComponentComms = (component) => {
        console.log("UPDATE COMMS > ", component.data.uuid);
        this.setIO(component);
    }


    /**
     * If a query changed => recreate the component and disconnect all current connections.
     * @param {*} component_uuid 
     */
    setIO = (component) => {

        //const component = this.dashboard.getComponent(component_uuid);
        const component_data = component.data;
        const [outputs, inputs] = component.content.getComponentIO();

        // only update pins (remove -> add) if different from existing ones
        if (this.ios.hasOwnProperty(component_data.uuid)) {
            if (equalsOrderedArrays(this.ios[component_data.uuid].inputs,inputs) && equalsOrderedArrays(this.ios[component_data.uuid].outputs, outputs)) {
                return;
            }
        }

        // already exists --- remove / disconnect all connections
        if (this.ios.hasOwnProperty(component_data.uuid)) {
            this.deleteComponent(component_data.uuid);            
        }

        this.createComponent(component_data.name, component_data.uuid, inputs, outputs);        

    }

    repaint = () => {
        this.instance.repaintEverything(); 
    }


}



