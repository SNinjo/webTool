$(document).ready(function() {

})


// 觸發時間軸:  keydown -> 按鍵 Input (keypress) -> keyup
// In theory, the onKeyDown and onKeyUp events represent keys being pressed or released, while the onKeyPress event represents a character being typed. The implementation of the theory is not same in all browsers.
function setKeyDown(e){
    // preventDefault() 必須在 keyDown 阻止

    if (e.key === "Enter"){
        e.preventDefault();

        //createLine(getLineNumber(), getTextAfterCursor());

        createParagraph(getNumber("Line"), getNumber("Paragraph"));
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

function getNumber(target, objFocus){
    if (objFocus == null) objFocus = window.getSelection().focusNode;

    while (getNumberFromId(target, objFocus.id) == null){
        objFocus = objFocus.parentNode;

        if (objFocus == document) return null;
    }
    return getNumberFromId(target, objFocus.id);
}

function getNumberFromId(target, Id){
    if (Id == null) return null;
    if (Id.indexOf(target + "_") != -1){
        return parseInt( Id.substring(Id.indexOf("_") + 1) );
    }
    else return null;
}

function createParagraph(lineNumber, paragraphNumber){
    var newLineNumber = lineNumber + 1;
    var newParagraphNumber = paragraphNumber + 1;
    updateLineNumber(newLineNumber, 1);
    $("#Paragraph_" + paragraphNumber).after('<div id="Paragraph_' + newParagraphNumber + '"><div id="Line_' + newLineNumber +'"></div></div>');

    getLineNumbers(newLineNumber + 1, true).forEach(moveLineNumber => {
        var moveLine = $("#Line_" + moveLineNumber)[0];
        $("#Line_" + moveLineNumber).remove();
        $("#Paragraph_" + newParagraphNumber).append(moveLine);
    })
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
    var arrayLines = getLineNumbers(intStartNumber);
    if (intDelta > 0) arrayLines = arrayLines.reverse();

    arrayLines.forEach(lineNumber => {
        $("#Line_" + lineNumber).attr("id", "Line_" + ( lineNumber + intDelta ));
    })
}

// 獲取 intStartNumber 行(包含)以後所有 lineNumber，可選擇是否同 paragraph
function getLineNumbers(intStartNumber, IsSameParagraph){
    if (IsSameParagraph == null) IsSameParagraph = false;

    var arrayLines = [];
    var updateNumber = intStartNumber;
    var updateElement = $("#Line_" + updateNumber);
    var objParagraph = updateElement[0].parentNode;
    var nextElement = $("#Line_" + ( updateNumber + 1 ));

    while (updateElement.length != 0){
        if ((IsSameParagraph) && (updateElement[0].parentNode != objParagraph)) break;
        arrayLines.push(updateNumber);

        updateNumber++;
        updateElement = nextElement;
        nextElement = $("#Line_" + ( updateNumber + 1 ));
    }
    return arrayLines;
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
