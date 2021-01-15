$(document).ready(function() {

    /*console.log(getTextPx("45613544561354456135445613544561354456135445613544561354456135445613544561354456135445613544561354456135445613544561"))
    createNewDiv($("#paragraph1"))
    $("#paragraph2").text("5567");

    console.log($("#paragraph4")[0].childNodes[1])
    tt($("#paragraph4")[0].childNodes[1].childNodes[0], 1);*/

    //console.log(getTextElement($("#editionType")[0], 6))
    //console.log(getTextElement($("#paragraph4")[0], 2))

    //console.log(getTextElement( $("#paragraph4")[0], 1))

})


var lastKey = "";
var vOffset;// 記住上下移動的位置
function setKeyEvent(e){
    var focusId = e.srcElement.id;
    var nextParagraph;

    // 文字游標跨 div 選取
    if (e.key === "ArrowUp"){
        // Prevent default behavior in text input while pressing arrow up
        e.preventDefault();

        if ((lastKey != "ArrowUp") && (lastKey != "ArrowDown")) {
            vOffset = getCursor();
        }

        var nextParagraph = $("#paragraph" + ( getParagraphId(focusId) - 1 ));
        if (nextParagraph[0] != null) {
            setCursor(nextParagraph[0], vOffset);
        }
    }
    else if (e.key === "ArrowDown"){
        e.preventDefault();
        
        if ((lastKey != "ArrowUp") && (lastKey != "ArrowDown")) {
            vOffset = getCursor();
        }

        var nextParagraph = $("#paragraph" + ( getParagraphId(focusId) + 1 ));
        if (nextParagraph[0] != null) {
            setCursor(nextParagraph[0], vOffset);
        }
    }
    // div 不能換行
    else if (e.key === "Enter"){
        e.preventDefault();
    }

    lastKey = e.key;
}

// 取得相對於 paragraph 的完整 offset
function getCursor(){
    var offset = window.getSelection().focusOffset;
    var objFocused = window.getSelection().focusNode;
    var objParent = objFocused.parentNode;

    while (true){
        // forEach 沒有 break 可以使用， return 也只能中斷此次不能跳出
        var boolIsBreak = false;
        objParent.childNodes.forEach(element => {
            if ((boolIsBreak) || (element == objFocused)) {
                boolIsBreak = true;
                return;
            }

            offset += element.textContent.length;
        })

        if (objParent.id.indexOf("paragraph") != -1) break;
        else if (objParent == document) return null;

        objFocused = objParent;
        objParent = objFocused.parentNode;
    }

    return offset;
}

function setCursor(el, offset) {
    // In most browsers, you need the Range and Selection objects. You specify each of the selection boundaries as a node and an offset within that node.
    // to set the caret(cursor) to the [offset] character of the [n] line of text
    // range.setStart(el.childNodes[n], offset)

    var range = document.createRange();
    var sel = window.getSelection();
    
    // 計算是第幾個 child 的多少 offset
    var currentOffset = 0, ithChild = 0;
    var textChild, textTarget;
    while (textChild = getTextElement(el, ++ithChild)){
        textTarget = textChild;
        currentOffset += textChild.length;

        if (currentOffset >= offset) {
            offset -= currentOffset - textChild.length;
            break;
        }
    }
    if (currentOffset < offset) offset = textTarget.length;
    else if (offset < 0) offset = 0;

    range.setStart(textTarget, offset);
    range.collapse(true);
    
    sel.removeAllRanges();
    sel.addRange(range);
}

// 從樹狀節點找尋下一個 text
var currentNumber = 0;
function getTextElement(localRoot, number) {
    currentNumber = 0;
    return getTextFromTree(localRoot, number);
}
function getTextFromTree(localRoot, number){
    // 判斷是否為 text
    if (localRoot.nodeType == 3) {
        // 去除僅有換行符的 text(排版用)
        if (localRoot.textContent.indexOf("\n") != -1) return;
        currentNumber++;
    }
    // 若 div 沒有 text，在符合條件下則回傳該 div
    else if (localRoot.nodeType == 1){
        if ((localRoot.childNodes.length == 0) && (currentNumber + 1 == number)){
            currentNumber++;
            return localRoot;
        }
    }

    if (currentNumber == number) return localRoot;
    for (var index = 0; index < localRoot.childNodes.length; index++){
        var result = getTextFromTree(localRoot.childNodes[index], number);
        if (result != null) return result;
    }

    //超出範圍
    return null;
}


function getTextPx(text){
    return $("#counter").text(text).width();
}


function getParagraphId(Id){
    return parseInt(Id.substring(Id.indexOf("h") + 1));
}


function createNewDiv(element){
    console.log(element[0].id);//
    var newNumber = getParagraphId(element[0].id) + 1;

    // update the paragraph number
    var updateNumber = newNumber;
    var updateElement = $("#paragraph" + updateNumber);
    var nextElement = $("#paragraph" + ( updateNumber + 1 ));
    while (updateElement.length != 0){
        updateElement.attr("id", "paragraph" + ( updateNumber + 1 ));

        updateNumber++;
        updateElement = nextElement;
        nextElement = $("#paragraph" + ( updateNumber + 1 ));
    }
    element.after('<div id="paragraph' + newNumber + '" class="article" contenteditable="true" onkeydown="setKeyEvent(event)"></div>');
}
