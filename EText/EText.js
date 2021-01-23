$(document).ready(function() {


})


// 觸發時間軸:  keydown -> 按鍵 Input (keypress) -> keyup
// In theory, the onKeyDown and onKeyUp events represent keys being pressed or released, while the onKeyPress event represents a character being typed. The implementation of the theory is not same in all browsers.
function setKeyDown(e){
    // preventDefault() 必須在 keyDown 阻止
    //console.log(window.getSelection())//
    //console.log(window.getSelection().getRangeAt(0))

    //e.preventDefault();//

    if (e.key === "Enter"){
        e.preventDefault();

        createLine(getLineNumber(), getTextAfterCursor());
    }
    else if (e.key === "Backspace"){
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);

        // 跨行刪除
        if (range.startContainer != range.endContainer){
            var intStartNumber = getLineNumber(range.startContainer);
            var intEndNumber = getLineNumber(range.endContainer);
            updateLineNumber(intEndNumber + 1, (intStartNumber - intEndNumber));
        }
        // 同行同點且第 0 格刪除
        else if ((sel.focusOffset == 0) && (range.startOffset == range.endOffset)){
            e.preventDefault();

            deleteLine(focusLineNumber);
        }
    }

}

function setKeyUp(e){

    // 判斷是否要換行 (Max = 1000 * 93%)
    if (getTextPx(window.getSelection().focusNode.textContent) > 930) {
        setCursor("Line_" + getLineNumber(), 0, getMaxTextCount());
        console.log(getMaxTextCount())//

        createLine(getLineNumber(), getTextAfterCursor(), "last");
    }

}

function getTextPx(text){
    return $("#counter").text(text).width();
}

function getMaxTextCount(){
    var text = window.getSelection().focusNode.textContent;
    var textSlice = text;
    var targetLength = text.length;

    while (getTextPx(textSlice) > 930){
        targetLength--;
        textSlice = textSlice.substring(0, targetLength);
    }
    return targetLength;
}

function getLineNumber(objFocusLine){
    if (objFocusLine == null) objFocusLine = window.getSelection().focusNode;

    while (getNumberFromId(objFocusLine.id) == null){
        objFocusLine = objFocusLine.parentNode;

        if (objFocusLine == document) return null;
    }
    return getNumberFromId(objFocusLine.id);
}

function getNumberFromId(Id){
    if (Id == null) return null;
    var index = Id.indexOf("_");
    if (index == -1) return null;
    return parseInt(Id.substring(index + 1));
}

function createParagraph(lineNumber, paragraphNumber, text){
    $("#paragraph_" + paragraphNumber).after('<div id="paragraph_' + paragraphNumber + '"></div>');
    createLine()
}

// number 行數、 text 換行新增文字、 offset 游標位置
function createLine(number, text, offset){
    // new line or empty line have to add <br>
    if ((text == null) || (text == "")) text = "<br>";
    // 刪除要換行的文字
    else {
        var originalText = $("#Line_" + number).text();
        $("#Line_" + number).text( originalText.substring(0, originalText.length - text.length) );
        if (originalText.length == text.length) $("#Line_" + number).html("<br>");
    }
    var newNumber = number + 1;

    updateLineNumber(newNumber, 1);
    $("#Line_" + number).after('<div id="Line_' + newNumber + '">' + text + '</div>');

    if (offset == null) offset = 0;
    else if (offset == "last") offset = text.length;
    setCursor("Line_" + newNumber, 0, offset);
}

function deleteLine(number){
    if (number == 1) return;

    var lastLineText = $("#Line_" + (number - 1)).text();
    var thisLineText = $("#Line_" + number).text();
    var lastTextLength = lastLineText.length;

    $("#Line_" + (number - 1)).text(lastLineText + thisLineText);
    // empty line have to add <br>
    // $.text("") 也會清除包含在內的元素節點
    if ((lastLineText == "") && (thisLineText == "")) $("#Line_" + (number - 1)).html("<br>");

    $("#Line_" + number).remove();
    updateLineNumber(number + 1, -1);
    setCursor("Line_" + (number - 1), 0, lastTextLength);
}

// 將 intStartNumber 行(包含)以後的 line number 加上 intDelta
function updateLineNumber(intStartNumber, intDelta){
    var updateNumber = intStartNumber;
    var updateElement = $("#Line_" + updateNumber);
    var nextElement = $("#Line_" + ( updateNumber + 1 ));

    while (updateElement.length != 0){
        updateElement.attr("id", "Line_" + ( updateNumber + intDelta ));

        updateNumber++;
        updateElement = nextElement;
        nextElement = $("#Line_" + ( updateNumber + 1 ));
    }
}

function setCursor(Id, n, offset){
    // 此為將游標設置在第 n個元素節點的第 offset格位置
    var el = $("#" + Id)[0].childNodes[n];
    var range = document.createRange();
    var sel = window.getSelection();

    if (offset == "last") offset = el.textContent.length;
    
    // setStart() 要設定在 #text
    range.setStart(el, offset);
    range.collapse(true)
    
    sel.removeAllRanges();
    sel.addRange(range);
}

function getTextAfterCursor(){
    var selected = window.getSelection();
    var offset = selected.focusOffset;
    var text = selected.focusNode.textContent;
    var length = text.length;
    if (length == null) index = 0;

    if (offset == length) return "";
    else return text.substring(offset, length);
}
