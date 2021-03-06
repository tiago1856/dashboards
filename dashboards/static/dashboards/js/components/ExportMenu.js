
import { Div, Link } from '../builders/BuildingBlocks.js';

/**
 * Component's export menu dropdown.
 */
export const ExportMenu = (onPrint=null, onPDF_portrait=null, onPDF_landscape=null, onImage=null, onExcel=null, onCSV=null) => {
    const div = new Div();
    div.addClass("dropdown-menu pull-right");
    div.setAttribute('role','menu');
  
    const print_link = new Link().attachTo(div);
    print_link.addClass('dropdown-item');
    print_link.setTextContent('Imprimir');
    print_link.setAttribute('href','javascript:void(0);');
  
    const pdf_link_portrait = new Link().attachTo(div);
    pdf_link_portrait.addClass('dropdown-item');
    pdf_link_portrait.setTextContent('PDF (vertical)');
    pdf_link_portrait.setAttribute('href','javascript:void(0);');

    const pdf_link_landscape = new Link().attachTo(div);
    pdf_link_landscape.addClass('dropdown-item');
    pdf_link_landscape.setTextContent('PDF (horizontal)');
    pdf_link_landscape.setAttribute('href','javascript:void(0);');    
  
    const image_link = new Link().attachTo(div);
    image_link.addClass('dropdown-item');
    image_link.setTextContent('Imagem');
    image_link.setAttribute('href','javascript:void(0);');
  
    const divider = new Div().attachTo(div);
    divider.addClass('dropdown-divider');
  
    const excel_link = new Link().attachTo(div);
    excel_link.addClass('dropdown-item');
    excel_link.setTextContent('Excel');
    excel_link.setAttribute('href','javascript:void(0);');
  
    const csv_link = new Link().attachTo(div);
    csv_link.addClass('dropdown-item');
    csv_link.setTextContent('CSV');
    csv_link.setAttribute('href','javascript:void(0);');

    if (onPrint) {
      $(print_link.dom).on('click',() => {
        onPrint();
      })
    }

    if (onPDF_portrait) {
      $(pdf_link_portrait.dom).on('click',() => {
        onPDF_portrait();
      })
    }

    if (onPDF_landscape) {
      $(pdf_link_landscape.dom).on('click',() => {
        onPDF_landscape();
      })
    }    
    
    if (onImage) {
      $(image_link.dom).on('click',() => {
        onImage();
      })
    }    

    if (onExcel) {
      $(excel_link.dom).on('click',() => {
        onExcel();
      })
    }
    if (onCSV) {
      $(csv_link.dom).on('click',() => {
        onCSV();
      })
    }  

    return div;
  }