/* eslint no-unused-vars: off*/
/* global monaco:true  */
/* exported deleteProject */

//monaco code
//var myBinding = editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function() {
  //  console.log('SAVE pressed!');
//});
var love = 'heyho';
//alert('lol');
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};
 
var editor;
var storedEditor = localStorage.getObject("editorStorage");
var editorStorage = storedEditor ? storedEditor : {};
var savedEditor = localStorage.getObject("editorStorage") && localStorage.getObject("editorStorage")[window.location.href] ? localStorage.getObject("editorStorage")[window.location.href]  : "";

// Explanation:
// Press F1 (Alt-F1 in IE) => the action will appear and run if it is enabled
// Press Ctrl-F10 => the action will run if it is enabled
// Press Chord Ctrl-K, Ctrl-M => the action will run if it is enabled
 
//require(['vs/editor/editor.main'], function() {
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('vseditor'), {
        value: savedEditor,
        language: 'javascript',
        theme: 'vs-dark',
    });
    
    function addRunAction(){
        editor.addAction({
            // An unique identifier of the contributed action.
            id: 'runCode',
            
            // A label of the action that will be presented to the user.
            label: 'Run',
            
            // An optional array of keybindings for the action.
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
            ],
            
            // A precondition for this action.
            precondition: null,
            
            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
            keybindingContext: null,
            
            contextMenuGroupId: 'navigation',
            
            contextMenuOrder: 1.5,
            
            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convinience
            run: function(ed) {
                document.getElementById("myLog").innerHTML = "";
                storeJS();
                evaluate(ed.getValue());
                return null;
            }
        });
        
    }
    addRunAction();
});

function storeJS(){
    var projectName= document.getElementById('projectName').value || window.location.href;
    editorStorage[projectName] = editor.getValue();
    localStorage.setObject("editorStorage", editorStorage);
    listProjects();
}

function deleteProject(){
    var projectName = document.querySelector('#projectName').value;
    delete editorStorage[projectName];
    localStorage.setObject("editorStorage", editorStorage);
    listProjects();
}


function listProjects(){
    document.getElementById("editor-storage").innerHTML = "";
Object.keys(editorStorage).forEach(function(key){
    document.getElementById("editor-storage").innerHTML = document.getElementById("editor-storage").innerHTML +"<div class='btn btn-outline-light btn-block'>" + key  + "</div>" ;
});}


var allProjects = document.querySelector("#editor-storage");
allProjects.addEventListener("click", loadProject, false);


function loadProject(e) {
    if (e.target !== e.currentTarget) {
        var tagname = e.target.tagName; // jshint ignore:line
        var clickedItem = e.target.innerHTML;
        //onsole.log(clickedItem);
        document.querySelector('#projectName').value = clickedItem;
        editor.setValue(editorStorage[clickedItem]);
    }
    e.stopPropagation();
}


////////////////////////////
// DOWNLOAD JAVASCRIPT AS FILE

var repl = {};

repl.createFile = function(content, name) {
    var js = document.createElement('a');
    js.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    js.setAttribute('download', name + '.js');
    document.body.appendChild(js);
    js.click();
  };

repl.downloadJS = function(){
    var fileName= document.getElementById('projectName').value || 'script';
    console.log(document.getElementById.value);
    console.log(fileName);
    repl.createFile(editor.getValue(), fileName);
};


///////////////////////////////////////////////////////
//ESCAPE HTML TO PRINT TO CONSOLE
function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    var newtext = text ? text.toString().replace(/[&<>"']/g, function(m) { return map[m];}) : text == 'false' ? 'false' : typeof text ;

  
    return newtext;
  }


////////////////////////LOG//////////////////////////////
var glitch = false;

window.console = {
    logg: this.console.log,
    log: function(str){
        str = escapeHtml(str);
      var node = document.createElement("div");
      if (glitch){
        node.classList.add("glitch");
        node.setAttribute("data-text", str );
        var odds = Math.floor((Math.random() * 100) + 1);
        if (odds > 93) { node.classList.add("glitchactive");}
      }
      //node.appendChild(document.createTextNode(str));
      node.innerHTML = str;
      document.getElementById("myLog").appendChild(node);
    },
    error: function(str){

        var node = document.createElement("div");
        //node.appendChild(document.createTextNode(str));
        node.innerHTML = str;
        document.getElementById("myLog").appendChild(node);
    },
    warn: this.console.warn,
  };


function evaluate(code) {
    try{
        eval(code); // jshint ignore:line
    }
    catch(e){
    var error = e.stack.split("eval")[0]; // jshint ignore:line
    var line = e.stack.split(")")[1].substr(1);
    console.log(error + " " + line );
    console.log(e.stack);
    }
}

