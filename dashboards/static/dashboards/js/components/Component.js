
import { Div, AwesomeIconAndButton, Text, Ul, Li, Link} from '../builders/BuildingBlocks.js';
import { ComponentData } from './ComponentData.js';
/**
 * 
 */
export class Component extends Div {
    constructor(context, spot, _title=null, h100 = false, color_scheme = 'light') {
        super(context);
        this.addClass('Component card mb-1');
        this.addClass('card-' + color_scheme);
        
        this.data = { ...ComponentData};

        this.spot = spot;
        this.data.spot = this.spot;

        //if (vh100) this.setStyle('min-height','100%');
        if (h100) this.addClass('full-height');

        this.context = context;   

        const header = new Div().attachTo(this);
        header.addClass('card-header py-1 px-2');       
        
        this.title = new Text().attachTo(header);
        this.title.addClass('card-title');
        this.setTitle(_title);
        
        const card_tools = new Div().attachTo(header);
        card_tools.addClass('card-tools');


        const open_btn = new AwesomeIconAndButton('','fas fa-folder-open').attachTo(card_tools);
        open_btn.addClass('btn btn-sm text-danger editable-component');
        open_btn.setAttribute('type','button');
        open_btn.setAttribute('data-toggle','tooltip');
        open_btn.setAttribute('title','Abrir component');

        const save_btn = new AwesomeIconAndButton('','fas fa-save').attachTo(card_tools);
        save_btn.addClass('btn btn-sm text-danger editable-component');
        save_btn.setAttribute('type','button');
        save_btn.setAttribute('data-toggle','tooltip');
        save_btn.setAttribute('title','Guardar component');

        const display_btn = new AwesomeIconAndButton('','fas fa-tv').attachTo(card_tools);
        display_btn.addClass('btn btn-sm text-danger editable-component');
        display_btn.setAttribute('type','button');
        display_btn.setAttribute('data-toggle','tooltip');
        display_btn.setAttribute('title','Editar visualização');

        const add_query_btn = new AwesomeIconAndButton('','fas fa-plus').attachTo(card_tools);
        add_query_btn.addClass('btn btn-sm text-danger editable-component');
        add_query_btn.setAttribute('type','button');
        add_query_btn.setAttribute('data-toggle','tooltip');
        add_query_btn.setAttribute('title','Nova/Editar Query');        

        const add_template_btn = new AwesomeIconAndButton('','fas fa-calendar-plus').attachTo(card_tools);
        add_template_btn.addClass('btn btn-sm text-danger editable-component');
        add_template_btn.setAttribute('type','button');
        add_template_btn.setAttribute('data-toggle','tooltip');
        add_template_btn.setAttribute('title','Novo/Editar Template');

        this.options_btn = new AwesomeIconAndButton('','fas fa-cog').attachTo(card_tools);
        this.options_btn.addClass('btn btn-sm non-editable-component');    // no dropdown-toggle --- no caret
        this.options_btn.setAttribute('type','button');
        this.options_btn.setAttribute('data-toggle','dropdown');
        this.options_btn.setAttribute('role','menu');       
        const ul_options = new Ul().attachTo(this.options_btn);  
        ul_options.addClass('dropdown-menu');
        new Item("11111",() => {
            console.log("1111111111111");
        }).attachTo(ul_options);        
        new Item("2222",() => {
            console.log("222222222222");
        }).attachTo(ul_options);
        new Item(null, null, true).attachTo(ul_options);
        new Item("333333",() => {
            console.log("33333333333");
        }).attachTo(ul_options);
        new SubMenu('title',[
            {title:'title 1', selection: () => {console.log("title 1");}},
            {title:'title 2', selection: () => {console.log("title 2");}},
            {title:'title 3', selection: () => {console.log("title 3");}},
        ]).attachTo(ul_options);


        const print_btn = new AwesomeIconAndButton('','fas fa-print').attachTo(card_tools);
        print_btn.addClass('btn btn-sm non-editable-component');
        print_btn.setAttribute('type','button');
        print_btn.setAttribute('data-toggle','tooltip');
        print_btn.setAttribute('title','Imprimir componente');

        const zoom_btn = new AwesomeIconAndButton('','fas fa-search-plus').attachTo(card_tools);
        zoom_btn.addClass('btn btn-sm non-editable-component');
        zoom_btn.setAttribute('type','button');
        zoom_btn.setAttribute('data-toggle','tooltip');
        zoom_btn.setAttribute('title','Ampliar componente');

        const collapse_btn = new AwesomeIconAndButton('','fas fa-minus').attachTo(card_tools);
        collapse_btn.addClass('btn btn-sm non-editable-component');
        collapse_btn.setAttribute('type','button');
        collapse_btn.setAttribute('data-card-widget','collapse');
        collapse_btn.setAttribute('data-toggle','tooltip');
        collapse_btn.setAttribute('title','Collapsar componente');

        const close_btn = new AwesomeIconAndButton('','fas fa-times').attachTo(card_tools);
        close_btn.addClass('btn btn-sm non-editable-component');
        close_btn.setAttribute('type','button');
        close_btn.setAttribute('data-card-widget','remove');
        close_btn.setAttribute('data-toggle','tooltip');
        close_btn.setAttribute('title','Remover componente');

        this.body = new Div().attachTo(this);
        this.body.addClass('card-body');

        
        $(add_query_btn.dom).on('click',function() {
          context.signals.onEditComponent.dispatch(self.spot);
        });
        

        
        // necessary, otherwise only the contents collapse/show and not the box itself.
        const self = this;
        if (h100) {
          $(collapse_btn.dom).on('click', function() {
            if (self.hasClass('full-height')) {             
              $(self.dom).animate({height: '34px'}, 'slow', () => {
                self.removeClass('full-height');                
              });
              
            } else {            
              $(self.dom).animate({height: '100%'}, 'slow', () => {
                self.addClass('full-height');
              });              
            }
          });
        }       
    }

    getBody() {
      return this.body;
    }

    getOptionsButton() {
      return this.options_btn;
    }

    /**
     * Clear the body of the card, by removing all element.
     */
    clearBody() {
      $(this.body.dom).empty();
    }

    setTitle(_title) {
      if (_title) {
        this.title.setTextContent(_title);
        this.data.title = _title;
      } else {
        this.title.dom.innerHTML = '<span style="color: red;">Titulo não definido!</span>';
      }
    }

    getComponentData() {
      return this.data;
    }
}


      


class SubMenu extends Li {
    constructor(title, subitems) {
      super();
      this.addClass('dropdown-submenu sub-menu-right')
      const link = new Link().attachTo(this);
      link.addClass('dropdown-item dropdown-toggle');

      //link.setAttribute('href','#');
      link.setTextContent(title);
      const ul = new Ul().attachTo(this);
      ul.addClass('dropdown-menu');
      subitems.forEach(item => {
        new Item(item.title, item.selection).attachTo(ul);
      })
      
      $(link.dom).on('click', function(e) {
          var submenu = $(this);
          $('.dropdown-submenu .dropdown-menu').removeClass('show');
          submenu.next('.dropdown-menu').addClass('show');
          e.stopPropagation();
      });
      $(link.dom).hover(function(e) {
        var submenu = $(this);
        $('.dropdown-submenu .dropdown-menu').removeClass('show');
        submenu.next('.dropdown-menu').addClass('show');
        e.stopPropagation();
      });
      
    }
  }

// <li class="divider"></li>

class Item extends Li {
    constructor(title, onSelection, isDivider = false) {
        super();        
        if (isDivider) {
            this.addClass('dropdown-divider');
            return;
        }
        this.addClass('dropdown-item');
        const link = new Link().attachTo(this);
        //link.addClass('text-danger');
        link.setTextContent(title);  
        $(link.dom).on('click',function() {
            if (onSelection) onSelection();
        })
        
        $(link.dom).hover(function(e) {
            var submenu = $(this);
            if (!submenu.parent().parent().parent().hasClass('dropdown-submenu')) {
            $('.dropdown-submenu .dropdown-menu').removeClass('show');
            }      
        });
      
    }
}