let tagSelector;
let tagRedTeam;
let tagBlueTeam;
let tagFigureListInputText;
let tagSystemHintText;
window.onload = function() {
    tagSelector = document.getElementById("figureListSelector");
    tagRedTeam = document.getElementById("redTeam");
    tagBlueTeam = document.getElementById("blueTeam");
    tagFigureListInputText = document.getElementById("figureListInputText");
    tagSystemHintText = document.getElementById("systemHintText");

    readAllFigureList();

    setDefaultFigureListInput(strDefaultFigureList);
}

function readAllFigureList(){
    clearFigureList();

    let index = 0;
    setFigureList.forEach(element => {
        generateFigureList(index++, element);
    });
    
    selectAllFigureList();
}
function generateFigureList(intFigureId, strFigureName){
    tagNew = document.createElement("p");
    tagSelector.appendChild(tagNew);
    tagNew.innerHTML = `
        <input id="figure${intFigureId}" type="checkbox" value="${strFigureName}" onclick="selectFigure(this)">
        <label for="figure${intFigureId}"> ${strFigureName} </label>
    `;
}
function clearFigureList(){
    tagSelector.innerHTML = "";
}
function isSelectedTenFigure(){
    return setSelectedFigureList.size === 10;
}


function setFigureListInputText(strInput){
    tagFigureListInputText.value = strInput;
}


function displayGroupingResult(){
    clearSystemHint();
    if (isSelectedTenFigure() === false) systemHint("the number of selected people isn't 10 (" + setSelectedFigureList.size + " people have been selected)");

    clearTeammateList();

    teamRed.getTeammate().forEach(element => {
        generateTeammateList(element, true);
    });
    teamBlue.getTeammate().forEach(element => {
        generateTeammateList(element, false);
    });
}
function generateTeammateList(strTeammateName, isRedTeam){
    tagNew = document.createElement("p");
    (isRedTeam ? tagRedTeam : tagBlueTeam).appendChild(tagNew);
    tagNew.innerHTML = strTeammateName;
}

function clearTeammateList(){
    tagRedTeam.innerHTML = "";
    tagBlueTeam.innerHTML = "";
}


function systemHint(strSystemHint){
    tagSystemHintText.innerText = "System Hint: " + strSystemHint;
}
function clearSystemHint(){
    tagSystemHintText.innerText = "";
}


function setDefaultFigureListInput(strFigureList) {
    document.getElementById("figureListInputText").value = strFigureList;
}




/* event */
function gotoTutorialPage(){
    window.open("tutorial.html");
}

function sendFigureListByText(){
    getFigureListByLOLChatroomMessage(tagFigureListInputText.value);
    readAllFigureList();
}
function pasteFigureListByString(){
    tagFigureListInputText.focus();
    
    navigator.clipboard.readText()
        .then(strClipboardText => {
            setFigureListInputText(strClipboardText);
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
    });
}

function readomGrouping(){
    [teamRed, teamBlue] = Team.randomGrouping(setSelectedFigureList);
    displayGroupingResult();
}

function selectFigure(tagFigureCheckbox){
    reverseFigureSelectedState(tagFigureCheckbox);
}




/* test */
function selectAllFigureList(){
    for (let index = 0; index < setFigureList.size; index++) {
        let tagFigureCheckbox = document.getElementById("figure" + index);
        tagFigureCheckbox.checked = true;
    }

    setSelectedFigureList = setFigureList;
}

function test(){
    return [1, new Team([])];
}
