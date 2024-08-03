function generate() {
    var texts = document.getElementById("text").value;
    var drop = document.getElementById('drop');
    var codeImg = document.getElementById("code-img");
    
    // Clear previous code if any
    codeImg.innerHTML = "";
    
    // Generate QR code
    var code = new QRCode(codeImg, {
        text: texts,
        width: 128,
        height: 128
    });
    
    // Hide the drop-down menu
    drop.style.display = "none";
}
