$(document).ready(function() {

    // 讓 textarea 可以輸入 tab
    $("#article01")[0].onkeydown = function(e) { inputTab(e, $("#article01")) };
    $("#article02")[0].onkeydown = function(e) { inputTab(e, $("#article02")) };

    $("#article01").on('change keyup paste', function() {
        compareText();
        showLineNumber($("#articleLineNumber01"), count($("#article01").val(), /\n/g));
        $("#articleLineNumber01").scrollTop( $("#article01").scrollTop() );
    });
    $("#article02").on('change keyup paste', function() {
        compareText();
        showLineNumber($("#articleLineNumber02"), count($("#article02").val(), /\n/g));
        $("#articleLineNumber02").scrollTop( $("#article02").scrollTop() );
    });
    
    // LineNumber 的卷軸與 article 同步 (文章輸入時也需要改變)
    $("#article01").scroll(function() {
        $("#articleLineNumber01").scrollTop( $("#article01").scrollTop() );
    });
    $("#article02").scroll(function() {
        $("#articleLineNumber02").scrollTop( $("#article02").scrollTop() );
    });

})


function inputTab(e, textarea){
    if (e.key === "Tab"){
        e.preventDefault();
        textarea.val(textarea.val() + "\t");
    }
}


function compareText(){
    var article01 = $("#article01").val();
    var article02 = $("#article02").val();
    $("#result01").text("");
    $("#result02").text("");
    $("#result01").hide();
    $("#result02").hide();
    $("#resultLineNumber01").hide();
    $("#resultLineNumber02").hide();
    $("#editionType_result").css("height", "60px");

    if ((article01.length == 0) || (article02.length == 0)) {
        $("#compareResult").text("請輸入要比較的文章");
    }
    else if (article01 == article02) $("#compareResult").text("兩篇文章皆相同");
    else if (article01.replace(/\s/g, "") == article02.replace(/\s/g, "")) $("#compareResult").text("兩篇文章內容相同 (僅空白符不同)");
    else {
        article01 = article01.split("\n");
        article02 = article02.split("\n");
        var index = 0, intDifference = 0, arrayLineNumber = [];
        var strNewText01 = "", strNewText02 = "";

        for (; (index < article01.length) || (index < article02.length); index++){
            var element01 = article01[index];
            var element02 = article02[index];
            if (element01 != element02) {
                intDifference++;

                if (element01 == null) element01 = "[null]";
                if (element02 == null) element02 = "[null]";
                strNewText01 += element01 + "\n";
                strNewText02 += element02 + "\n";

                arrayLineNumber.push(index);
            }
        }
        if (strNewText01.length != 0) strNewText01 = strNewText01.substring(0, strNewText01.lastIndexOf("\n"));
        if (strNewText02.length != 0) strNewText02 = strNewText02.substring(0, strNewText02.lastIndexOf("\n"));
        $("#result01").text(strNewText01);
        $("#result02").text(strNewText02);
        
        $("#editionType_result").css("height", 22 * intDifference + 110 +"px");
        $("#compareResult").text("共有 " + intDifference + "行不一樣");

        $("#result01").show();
        $("#result02").show();
        $("#resultLineNumber01").show();
        $("#resultLineNumber02").show();
        $("#result01").css("height", 22 * intDifference + 23 +"px");
        $("#result02").css("height", 22 * intDifference + 23 +"px");
        $("#resultLineNumber01").css("height", 22 * intDifference + 23 +"px");
        $("#resultLineNumber02").css("height", 22 * intDifference + 23 +"px");
        showLineNumberByArray($("#resultLineNumber01"), arrayLineNumber);
        showLineNumberByArray($("#resultLineNumber02"), arrayLineNumber);
    }


    console.log(article01);//
    console.log(article02);//
}

function showLineNumber(element, number){
    var newText = "";
    for (var index = 0; index <= number; index++) newText += index + " \n";
    element.text(newText);
}
function showLineNumberByArray(element, array){
    element.text(array.join(" \n") + " ");
}

function count(string, regex){
    // null.length 會出錯，因此補上: || []
    // regex 斜線後加上 g  代表符合全選
    return (string.match(regex) || []).length;
}
