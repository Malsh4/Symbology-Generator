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

            } else if (selectedSymbology === 'Aztec Code') {  
                const canvas = document.createElement('canvas');
                codeImgDiv.appendChild(canvas);

                bwipjs.toCanvas(canvas, {
                    bcid: 'azteccode',
                    text: inputText,
                    scale: 3,
                    includetext: false
                });

                generatedCode = canvas.toDataURL("image/png");

            }
            else if (selectedSymbology === 'EAN-13') {
                const inputText = textInput.value.trim();
        
                if (!/^\d{12,13}$/.test(inputText)) {
                    alert("EAN-13 requires 12 or 13 numeric digits.");
                    return;
                }
        
                const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                codeImgDiv.appendChild(svgElement);
        
                JsBarcode(svgElement, inputText, {
                    format: "EAN13",
                    width: 2,
                    height: 100,
                    displayValue: true,
                    margin: 0,
                    fontSize: 14,
                    textMargin: 5
                });
        
                generatedCode = "data:image/svg+xml;base64," + btoa(svgElement.outerHTML);
        
            } else if (selectedSymbology === 'CODE39') {
                const inputText = textInput.value.trim();
            
                if (!/^[A-Z0-9\-.\$\/+% ]+$/.test(inputText)) {
                    alert("CODE39 only supports uppercase letters (A-Z), numbers (0-9), and special characters (- . $ / + % space).");
                    return;
                }
            
                const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                codeImgDiv.appendChild(svgElement);
            
                JsBarcode(svgElement, inputText, {
                    format: "CODE39",
                    width: 2,
                    height: 100,
                    displayValue: true, 
                    margin: 0,
                    fontSize: 14, 
                    textMargin: 5
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

            // Enable Save button for new generated code
            saveButton.textContent = 'Save';
            saveButton.disabled = false;

        } catch (error) {
            alert('Error generating code: ' + error.message);
        }
    }

    saveButton.addEventListener('click', saveCode);

    function saveCode() {
        if (!generatedCode) return;

        const a = document.createElement('a');
        a.href = generatedCode;
        a.download = 'code.png';
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

        // Reset the Save button when regenerating a new code
        saveButton.textContent = 'Save';
        saveButton.disabled = false;
    }
});
