

/**
 * Get a canvas representing the contents of a scrollable area.
 * It expands the area, put the contents in a canvas, restores the area.
 * @param {node} body Component body.
 * @returns Canvas.
 */
export async function getAreaCanvas(body = null) {
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

export async function getSimpleAreaCanvas(body = null) {
    if (!body) return null;
    const canvas = await html2canvas(body, {logging:false, scale: 1});
    return canvas;
}

// ----------------------------
// ----------------------------
// SCROLLABLE AREA -> PDF
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
 * Creates a PDF file from a scrollable area.
 * @param {node} body Component body.
 * @param {string} filename PDF output file.
 * @returns 
 */
export async function exportArea2PDF(body=null, filename='component') {
    const canvas = await getAreaCanvas(body);
    if (!canvas) return null;
    return await exportCanvas2PDF(canvas, filename);
}


// ----------------------------
// ----------------------------
// SCROLLABLE AREA -> IMAGE
// ----------------------------
// ----------------------------

/**
 * Creates a PNG file from a scrollable area.
 * @param {node} body Component body.
 * @param {string} filename PDF output file.
 * @returns 
 */
export async function exportArea2PNG(body=null, filename='component') {
    const canvas = await getAreaCanvas(body);
    if (!canvas) return null;
    var link = document.createElement('a');
    link.download = filename + '.png';
    link.href = canvas.toDataURL()
    link.click();
    link.remove();
}


