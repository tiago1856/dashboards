
import { CardComponent } from './CardComponent.js';
import { NonCardComponent } from './NonCardComponent.js';

export const CONTAINER_TYPE = {
    CARD: "CARD",
    NONCARD: "NONCARD",
}


export async function CreateComponent(type = CONTAINER_TYPE.CARD, parent=null, context, spot, title=null, color_scheme = 'light', data=null, new_uuid = false, component_content=null) {
    let component = null;
    switch (type) {
        case CONTAINER_TYPE.CARD:
            component = new CardComponent(context, spot, title, color_scheme, data, new_uuid);
            if (parent) component.attachTo(parent);
            if (data) await component.setContent(null, component_content);
            break;
        default:
            component = new NonCardComponent(context, spot, title, color_scheme, data, new_uuid);
            if (parent) component.attachTo(parent);
            if (data) await component.setContent(null, component_content);    
    }
    return Promise.resolve(component);
}


