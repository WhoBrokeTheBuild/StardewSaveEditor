
var upload = null;
var editor = null;
var file = null;

var xml = null;
var filename = null;

const wikiURL = "https://stardewvalleywiki.com";
const shirtURL = wikiURL + "/mediawiki/images/d/db/Shirt"

function getShirtURL(id) {
    return wikiURL + "/mediawiki/images/d/db/Shirt" + id.padStart(3, '0') + ".png";
}

function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        return true;
    }
    
    alert("Your browser somehow doesn't support the File API");
    return false;
}

function loadEditor() {
    console.log(xml);

    var textInputs = document.getElementsByClassName('js-textInputs');
    for (var i = 0; i < textInputs.length; i++) {
        var path = textInputs[i].name.replaceAll('.', ' ');
        var data = xml.querySelector(path);
        if (data) {
            textInputs[i].value = data.textContent;
        }
        else {
            textInputs[i].value = '';
        }
    }

    var radioInputs = document.getElementsByClassName('js-radioInputs');
    for (var i = 0; i < radioInputs.length; i++) {
        var path = radioInputs[i].name.replaceAll('.', ' ');
        var data = xml.querySelector(path);
        if (data) {
            radioInputs[i].checked = (radioInputs[i].value == data.textContent);
        }
        else {
            radioInputs[i].checked = false;
        }
    }


}

function saveEditor() {
    var textInputs = document.getElementsByClassName('js-textInputs');
    for (var i = 0; i < textInputs.length; ++i) {
        var path = textInputs[i].name.replaceAll('.', ' ');
        var data = xml.querySelector(path);
        if (data) {
            data.textContent = textInputs[i].value;
        }
    }

    var radioInputs = document.getElementsByClassName('js-radioInputs');
    for (var i = 0; i < radioInputs.length; i++) {
        var path = radioInputs[i].name.replaceAll('.', ' ');
        var data = xml.querySelector(path);
        if (data && radioInputs[i].checked) {
            data.textContent = radioInputs[i].value;
        }
    }

    var xmlSerializer = new XMLSerializer();

    var tmp = document.createElement('a');
    var text = xmlSerializer.serializeToString(xml);
    tmp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    tmp.setAttribute('download', filename);
    tmp.click();
    document.body.removeChild(tmp);
}

window.onload = function() {
    if (!checkFileAPI()) {
        return;
    }

    upload = document.getElementById('upload');
    editor = document.getElementById('editor');
    file = document.getElementById('file');

    upload.onsubmit = function(e) {
        e.preventDefault();

        var reader = new FileReader();
        reader.onload = function(e) {
            text = e.target.result;
            var parser = new DOMParser();
            xml = parser.parseFromString(text, "application/xml");
            loadEditor();
        }

        filename = file.files[0].name;
        reader.readAsText(file.files[0]);
    }

    editor.onsubmit = function(e) {
        e.preventDefault();
        saveEditor();
    }
}
