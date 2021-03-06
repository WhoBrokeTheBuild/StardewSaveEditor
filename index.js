
var upload = null;
var editor = null;
var file = null;

var xml = null;
var filename = null;

function varNameToLabel(str) {
    if (str.length == 0) {
        return "";
    }

    str = str.charAt(0).toUpperCase() + str.slice(1);
    var length = str.length;
    for (var i = 1; i < length; i++) {
        if (str.charAt(i) == str.charAt(i).toUpperCase()) {
            str = str.slice(0, i) + ' ' + str.slice(i);
            length += 1;
            i += 1;
        }
    }

    return str;
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

    var changedEvent = new Event('change');

    var textOutputs = document.getElementsByClassName('js-textOutputs');
    for (var i = 0; i < textOutputs.length; i++) {
        var path = textOutputs[i].id.replaceAll('.', ' ');
        var data = xml.querySelector(path);
        if (data) {
            textOutputs[i].innerText = data.textContent;
        }
        else {
            textOutputs[i].innerText = '';
        }
    }

    var textInputs = document.getElementsByClassName('js-textInputs');
    for (var i = 0; i < textInputs.length; i++) {
        var path = textInputs[i].name.replaceAll('.', ' ');
        var data = xml.querySelector(path);
        if (data) {
            textInputs[i].value = data.textContent;
            textInputs[i].dispatchEvent(changedEvent);
        }
        else {
            textInputs[i].value = '';
        }
    }

    var checkInputs = document.getElementsByClassName('js-checkInputs');
    for (var i = 0; i < checkInputs.length; i++) {
        var path = checkInputs[i].name.replaceAll('.', ' ');
        var data = xml.querySelector(path);
        if (data) {
            checkInputs[i].checked = (data.textContent == "true");
            checkInputs[i].dispatchEvent(changedEvent);
        }
        else {
            checkInputs[i].checked = false;
        }
    }

    var radioInputs = document.getElementsByClassName('js-radioInputs');
    for (var i = 0; i < radioInputs.length; i++) {
        var path = radioInputs[i].name.replaceAll('.', ' ');
        var data = xml.querySelector(path);
        if (data) {
            radioInputs[i].checked = (radioInputs[i].value == data.textContent);
            radioInputs[i].dispatchEvent(changedEvent);
        }
        else {
            radioInputs[i].checked = false;
        }
    }

    var intArrayInputs = document.getElementsByClassName('js-intArrayInputs');
    var intArrayValues = { };
    for (var i = 0; i < intArrayInputs.length; i++) {
        var name = intArrayInputs[i].name;
        if (!(name in intArrayValues)) {
            var path = name.replaceAll('.', ' ');
            var data = xml.querySelectorAll(path + " int");
            if (data) {
                var tmp = [];
                for (var j = 0; j < data.length; j++) {
                    tmp.push(data[j].textContent);
                }
                intArrayValues[name] = tmp;
            }
        }

        intArrayInputs[i].checked = (intArrayValues[name].includes(intArrayInputs[i].value));
    }

    var stats = document.getElementById('stats');
    stats.innerHTML = '';
    
    var statsData = xml.querySelectorAll('SaveGame player stats > *');
    for (var i = 0; i < statsData.length; i++) {
        if (statsData[i].tagName == 'specificMonstersKilled') {
            return;
        }
        var value = statsData[i].textContent;
        if (statsData[i].tagName == 'averageBedtime') {
            value = value.slice(0, 2) + ':' + value.slice(2);
        }
        stats.innerHTML += '<span class="statLabel">' + varNameToLabel(statsData[i].tagName) + ': </span>' + value + '<br />';
    }
}

function saveEditor() {
    if (filename) {
        var textInputs = document.getElementsByClassName('js-textInputs');
        for (var i = 0; i < textInputs.length; ++i) {
            var path = textInputs[i].name.replaceAll('.', ' ');
            var data = xml.querySelector(path);
            if (data) {
                data.textContent = textInputs[i].value;
            }
        }

        var checkInputs = document.getElementsByClassName('js-checkInputs');
        for (var i = 0; i < checkInputs.length; i++) {
            var path = checkInputs[i].name.replaceAll('.', ' ');
            var data = xml.querySelector(path);
            if (data && checkInputs[i].checked) {
                data.textContent = (checkInputs[i].checked ? "true" : "false");
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

        var intArrayInputs = document.getElementsByClassName('js-intArrayInputs');
        var intArrayValues = { };
        for (var i = 0; i < intArrayInputs.length; i++) {
            var name = intArrayInputs[i].name;
            if (!(name in intArrayValues)) {
                intArrayValues[name] = [];
            }

            if (intArrayInputs[i].checked) {
                intArrayValues[name].push(intArrayInputs[i].value);
            }
        }

        for (var name in intArrayValues) {
            if (intArrayValues.hasOwnProperty(name)) {
                var path = name.replaceAll('.', ' ');
                var data = xml.querySelector(path);
                if (data) {
                    while (data.firstChild) {
                        data.removeChild(data.firstChild);
                    }
    
                    for (var i = 0; i < intArrayValues[name].length; i++) {
                        var tmp = xml.createElement('int');
                        tmp.textContent = intArrayValues[name][i];
                        data.appendChild(tmp);
                    }
                }
            }
        }

        var xmlSerializer = new XMLSerializer();
    
        var tmp = document.createElement('a');
        var text = xmlSerializer.serializeToString(xml);
        tmp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        tmp.setAttribute('download', filename);
        document.body.appendChild(tmp);
        tmp.click();
        document.body.removeChild(tmp);
    }
}

window.onload = function() {
    if (!checkFileAPI()) {
        return;
    }

    upload = document.getElementById('upload');
    editor = document.getElementById('editor');
    file = document.getElementById('file');

    document.getElementById('maxDailyLuck').onclick = function(e) {
        e.preventDefault();
        document.getElementById('SaveGame.dailyLuck').value = '0.1';
    }

    var seasonInputs = document.getElementsByClassName('js-season');
    for (var i = 0; i < seasonInputs.length; i++) {
        seasonInputs[i].addEventListener('change', function(e) {
            if (e.target.checked) {
                document.body.classList.remove("season-spring", "season-summer", "season-fall", "season-winter");
                document.body.classList.add("season-" + e.target.value);
            }
        })
    }

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
