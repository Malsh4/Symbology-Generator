document.addEventListener('DOMContentLoaded', function() {

const symbologySelect = document.getElementById('symbology');
const textInput = document.getElementById('text');
const codeImgDiv = document.getElementById('code-img');
const generateButton = document.getElementById('gen');
const dropDiv = document.querySelector('.drop');
const getInputDiv = document.querySelector('.get');
const buttonContainer = document.getElementById('button-container');

const saveButton = document.createElement('button');
saveButton.textContent = 'Save';
saveButton.id = 'save';
saveButton.style.display = 'none';

const regenerateButton = document.createElement('button');
regenerateButton.textContent = 'Re-Generate';
regenerateButton.id = 'regenerate';
regenerateButton.style.display = 'none';

let generatedCode;

generateButton.addEventListener('click', generate);

buttonContainer.appendChild(saveButton);
buttonContainer.appendChild(regenerateButton);

function generate() {
    const selectedSymbology = symbologySelect.value.trim();
    const inputText = textInput.value;

    codeImgDiv.innerHTML = ''; // Clear previous codes

    if (!inputText) {
        alert('Please enter text to generate the code.');
        return;
    }

    try {
        if (selectedSymbology === 'QR Code') {
            new QRCode(codeImgDiv, {
                text: inputText,
                width: 200,
                height: 200
            });
            generatedCode = codeImgDiv.querySelector('canvas').toDataURL("image/png");

        } else if (selectedSymbology === 'Bar Code') {
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            codeImgDiv.appendChild(svgElement);

            JsBarcode(svgElement, inputText, {
                format: "CODE128",
                width: 2,
                height: 40,
                displayValue: true
            });

            generatedCode = "data:image/svg+xml;base64," + btoa(svgElement.outerHTML);

        } else if (selectedSymbology === 'Data Matrix Code') {
            const canvas = document.createElement('canvas');
            codeImgDiv.appendChild(canvas);

            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrix',
                text: inputText,
                scale: 3,
                height: 10,
                width: 10,
                includetext: false
            });

            generatedCode = canvas.toDataURL("image/png");

        } else if (selectedSymbology === 'PDF417') {
            const canvas = document.createElement('canvas');
            codeImgDiv.appendChild(canvas);

            bwipjs.toCanvas(canvas, {
                bcid: 'pdf417',
                text: inputText,
                scale: 3,
                height: 10,
                width: 10,
                includetext: false
            });

            generatedCode = canvas.toDataURL("image/png");

        } else if (selectedSymbology === 'Aztec Code') {  // ✅ Add Aztec Code
            const canvas = document.createElement('canvas');
            codeImgDiv.appendChild(canvas);

            bwipjs.toCanvas(canvas, {
                bcid: 'azteccode', // Aztec Code
                text: inputText,
                scale: 3,
                includetext: false
            });

            generatedCode = canvas.toDataURL("image/png");

        } else if (selectedSymbology === 'UPC-A') {  
            if (!/^\d{12}$/.test(inputText)) {  
                alert("UPC-A requires exactly 12 numeric digits.");
                return;
            }
        
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            codeImgDiv.appendChild(svgElement);
        
            JsBarcode(svgElement, inputText, {
                format: "upc",  // ✅ Fixed format name
                width: 2,
                height: 50,
                displayValue: true
            });
        
            generatedCode = "data:image/svg+xml;base64," + btoa(svgElement.outerHTML);
        }
        else {
            alert('Selected symbology is not yet supported: ' + selectedSymbology);
            return;
        }

        saveButton.style.display = 'block';
        regenerateButton.style.display = 'block';
        dropDiv.style.display = 'none';
        getInputDiv.style.display = 'none';
        generateButton.style.display = 'none';

    } catch (error) {
        alert('Error generating code: ' + error.message);
    }
}





saveButton.addEventListener('click', saveCode);

function saveCode() {
    if (!generatedCode) return;

    const a = document.createElement('a');
    a.href = generatedCode;
    a.download = 'code.png'; // Or a suitable filename
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    saveButton.textContent = 'Saved!';
    saveButton.disabled = true;
}

regenerateButton.addEventListener('click', regenerateCode);

function regenerateCode() {
    textInput.value = '';
    symbologySelect.selectedIndex = 0;
    dropDiv.style.display = 'flex';
    getInputDiv.style.display = 'flex';
    generateButton.style.display = 'block';
    saveButton.style.display = 'none';
    regenerateButton.style.display = 'none';
    codeImgDiv.innerHTML = '';
}
});