const ACTIVATE_PRESS_DELAY = 500;
const SEARCH_DELAY = 50;

function displayFormattedText(text){
    console.log(`%c${text}`, 'color: yellow; font-size: 13px;padding: 2px 5px; background-color: black');
}

function compareTexts(key,text){
    key = key.toLowerCase();
    text = text.toLowerCase();
    key = key.replace(/[^a-zA-Z0-9]/g, '');
    text = text.replace(/[^a-zA-Z0-9]/g, '');
    return key.includes(text);
}

function activateAssist(){
    displayFormattedText("Assist mode activated");
    $("#assist").addClass("active");
    $("#assist #assist-input").focus();
}

function deactivateAssist(){
    displayFormattedText("Assist mode deactivated");
    $("#assist").removeClass("active");
    $("#assist #assist-input").val("");
}

function isAssistActive(){
    return $("#assist").hasClass("active");
}

function addSuggestion(key){
    displayFormattedText("Adding suggestion: " + key);
    suggestion = $(`<button class="assist-suggestion">${key}</button>`);
    suggestion.click(function(){
        MAPPINGS[key]();
    });
    $("#assist-suggestions").append(suggestion);
}

function getMatchedSuggestions(text){
    for(var key in MAPPINGS){
        if(compareTexts(key, text)){
            addSuggestion(key);
        }
    }
}


var timeOut = null;
$("#assist-input").on("input", function(){
    if(timeOut){
        clearTimeout(timeOut);
    }
    timeOut = setTimeout(function(){
        $("#assist-suggestions").empty();
        if($("#assist-input").val() != ""){
            getMatchedSuggestions($("#assist-input").val());
        }
    },SEARCH_DELAY)
});


// Detect double shift click 
var shiftClickCount = 0;
document.addEventListener('keydown', function(e) {
    displayFormattedText("Key pressed: " + e.keyCode);
    if (e.keyCode == 16) {
        if (e.shiftKey) {
            shiftClickCount++;
            if (shiftClickCount == 2) {
                if(!isAssistActive()){
                    activateAssist();
                }
                shiftClickCount = 0;
            }
            setTimeout(function() {
                shiftClickCount = 0;
            }
            , ACTIVATE_PRESS_DELAY);
        }
    }

    if(e.keyCode == 38){
        if(isAssistActive()){
            if(document.activeElement == $("#assist-input")[0]){
                $("#assist-suggestions button:last-child").focus();
            }
            else if(document.activeElement == $("#assist-suggestions button:first-child")[0]){
                $("#assist-input").focus();
            }
            else if(document.activeElement.classList.contains("assist-suggestion")){
                $(document.activeElement).prev().focus();
            }
        }
    }

    if (e.keyCode == 40) {
        if(isAssistActive()){
            if(document.activeElement == $("#assist-input")[0]){
                $("#assist-suggestions button:first-child").focus();
            }
            else if(document.activeElement == $("#assist-suggestions button:last-child")[0]){
                $("#assist-input").focus();
            }
            else if(document.activeElement.classList.contains("assist-suggestion")){
                $(document.activeElement).next().focus();
            }
        }
    }
});


// Detect click outside assist and remove assist mode
document.addEventListener("click", function(e) {
    if (!e.target.closest("#assist")) {
        if(isAssistActive()){
            deactivateAssist();
        }
    }
});