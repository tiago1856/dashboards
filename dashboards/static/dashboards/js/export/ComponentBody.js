

/**
 * Get a canvas representing the contents of a component's body.
 * @param {node} body Component body.
 * @returns Canvas.
 */
export async function getComponentBodyCanvas(body = null) {
    if (!body) return null;

    const currentPosition_y = body.scrollTop;
    const currentPosition_x = body.scrollLeft;
    const height = body.style.height;
    const width = body.style.width;
    body.style.height="auto";
    body.style.width=(body.scrollWidth + 15) + "px";

    const canvas = await html2canvas(body, {logging:false, scale: 1});

    body.style.height=height;
    body.style.width=width;
    body.scrollTop = currentPosition_y;
    body.scrollLeft = currentPosition_x;

    return canvas;
}

// ----------------------------
// ----------------------------
// COMPONENT BODY -> PDF
// ----------------------------
// ----------------------------

/**
 * Creates a pdf file from a canvas.
 * @param {node} canvas Canvas.
 * @param {string} filename PDF output file.
 * @returns 
 */
export async function exportCanvas2PDF(canvas = null, filename = 'component') {
    if (!canvas) return null;

    const { PDFDocument, PageSizes } = PDFLib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);
    const img = canvas.toDataURL('image/png');
    const w_ratio = page.getWidth() / canvas.width;
    const h_ratio = page.getHeight() / canvas.height;
    const ratio = w_ratio < h_ratio ? w_ratio : h_ratio;

    const pngImage = await pdfDoc.embedPng(img);
    page.drawImage(pngImage, {
        x: page.getWidth() / 2 - canvas.width * ratio / 2,
        y: page.getHeight() - canvas.height * ratio,
        width: canvas.width * ratio,
        height: canvas.height * ratio,
    }) 

    const pdfBytes = await pdfDoc.save();
    var file = new File([pdfBytes], filename + '.pdf', {
        type: "application/pdf;charset=utf-8",
    });
    saveAs(file);
}

/**
 * Creates a PDF file from the contents of a component's body.
 * @param {node} body Component body.
 * @param {string} filename PDF output file.
 * @returns 
 */
export async function exportComponentBody2PDF(body=null, filename='component') {
    const canvas = await getComponentBodyCanvas(body);
    if (!canvas) return null;
    return await exportCanvas2PDF(canvas, filename);
}

// ----------------------------
// ----------------------------
// COMPONENT BODY -> IMAGE
// ----------------------------
// ----------------------------

/**
 * Creates a PNG file from the contents of a component's body.
 * @param {node} body Component body.
 * @param {string} filename PDF output file.
 * @returns 
 */
export async function exportComponentBody2PNG(body=null, filename='component') {
    const canvas = await getComponentBodyCanvas(body);
    if (!canvas) return null;
    var link = document.createElement('a');
    link.download = filename + '.png';
    link.href = canvas.toDataURL()
    link.click();
    link.remove();
}


