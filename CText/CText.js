/* test case
我是朱ㄅㄅ
I am pig.
BMW V8
ASUS AX01
0123456789
ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦˊˇˋ˙
`~!@#$%^&*()_+-=[]{}\|;:'",./<>?，、。！：；「」『』【】
	縮排

*/
/*
中文:     5       注音+音節: 43
英文:     5       字母:      16
數字:     13
空白符:   13      [8, 4, 1] (\n, \s, \t)
標點符號: 44
*/

$(document).ready(function() {

    // 讓 textarea 可以輸入 tab
    var textarea = $("#article");
    textarea[0].onkeydown = function(e){
        if (e.key === "Tab"){
            e.preventDefault();
            textarea.val(textarea.val() + "\t");
        }
    }

    $("#article").on('change keyup paste', function() {
        countText();
    });


    setBubble([0, 0, 0], 0, 0, 0);
})


/* 判定 text
    空白符: 換行、空格、tab
    標點符號: `~!@#$%^&*()_+-=[]{}\|;:'",./<>?  ，、。！：；「」『』【】  共43個
    英文: 空白間隔為一單字，並計算剩餘字母
    數字: 0 - 9
    中文: 剩下一個字元數

    全域變數由 countText() -> setBubble()
*/
function countText(){
    var article = $("#article").val();

    var arraySpaceCounter = [count(article, /\n/g), count(article, /\s/g), count(article, /\t/g)];
    $("#spaceCounter").val( arraySpaceCounter[1] );
    arraySpaceCounter[1] -= arraySpaceCounter[0] + arraySpaceCounter[2];

    var regexPunctuation = new RegExp(/`|~|!|@|#|\$|%|\^|&|\*|\(|\)|_|\+|-|=|\[|\]|{|}|\||;|:|'|"|,|\.|\/|<|>|\?|，|、|。|！|：|；|「|」|『|』|【|】/g);
    $("#punctuationCounter").val( count(article, regexPunctuation) );
    article = article.replace(regexPunctuation, " ");


    var intWordCounter = 0;
    article = article.split(/\s+/);
    article.forEach(element => {
        // ^ 匹配必到開頭   $ 匹配必到結尾  + 符合則重複讀取
        // 判斷是否全為英文字母
        if ( /^[A-Za-z]+$/.test(element) ) intWordCounter++;
    });
    article = article.join("");
    article = article.replace(/^[A-Za-z]+$/, "");
    $("#englishCounter").val(intWordCounter);

    var intLetterCount = count(article, /[A-Za-z]/g);
    // show somewhere
    article = article.replace(/[A-Za-z]/g, "");


    $("#numberCounter").val( count(article, /[0-9]/g) );
    article = article.replace(/[0-9]/g, "");

    $("#chineseCounter").val( count(article, /[\u4E00-\u9FA5]/g) );
    article = article.replace(/[\u4E00-\u9FA5]/g, "");
    var intPhoneticCounter = count(article, /[\u3105-\u3129\u02CA\u02C7\u02CB\u02D9]/g);
    article = article.replace(/[\u3105-\u3129\u02CA\u02C7\u02CB\u02D9]/g, "");

    var intRemainder = article.length;
    showCountResult(intRemainder);


    setBubble(arraySpaceCounter, intLetterCount, intPhoneticCounter, intRemainder);
}

function count(string, regex){
    // null.length 會出錯，因此補上: || []
    // regex 斜線後加上 g  代表符合全選
    return (string.match(regex) || []).length;
}


function setBubble(arraySpaceCounter, intLetterCount, intPhoneticCounter, intRemainder){
    $("#chineseTitle")[0].onmouseover = function() {
        $("#bubble").text("計算中文字數 (注音與音節共 " + intPhoneticCounter + "個)");
    }
    $("#chineseCounter")[0].onmouseover = $("#chineseTitle")[0].onmouseover;

    $("#englishTitle")[0].onmouseover = function() {
        $("#bubble").text("計算英文字數 (無法辦別的字母數量有 " + intLetterCount + "個)");
    }
    $("#englishCounter")[0].onmouseover = $("#englishTitle")[0].onmouseover;

    $("#numberTitle")[0].onmouseover = function() {
        $("#bubble").text("計算阿拉伯數字字數 (0 ~ 9)")
    }
    $("#numberCounter")[0].onmouseover = $("#numberTitle")[0].onmouseover;

    $("#spaceTitle")[0].onmouseover = function() {
        $("#bubble").text("空白符代表換行(\\n)、空格(space)、縮排(\\t)  \
        共有 " + arraySpaceCounter[0] + "個換行符 " + arraySpaceCounter[1] + "個空格符 " + arraySpaceCounter[2] + "個縮排符");
    }
    $("#spaceCounter")[0].onmouseover = $("#spaceTitle")[0].onmouseover;

    $("#punctuationTitle")[0].onmouseover = function() {
        $("#bubble").text("計算除空白符以外的標點符號 (共收錄 43個鍵盤可以輸入的符號)")
    }
    $("#punctuationCounter")[0].onmouseover = $("#punctuationTitle")[0].onmouseover;

    $("#tr01Counter")[0].childNodes.forEach(element => {
        element.onmouseout = function() {showCountResult(intRemainder)};
    });
    $("#tr02Counter")[0].childNodes.forEach(element => {
        element.onmouseout = function() {showCountResult(intRemainder)};
    });
}

function showCountResult(intRemainder){
    if (intRemainder == 0) $("#bubble").text("")
    else $("#bubble").text("有 " + intRemainder + "個無法判別的字元 (此程式無法判別全形文字、其他語言)");
}


// 動態生成對話框(此程式沒有使用到)
function createBubble(arrayPosition, strContent){
    var htmlBubble = "                  \
        <div id='bubble'>               \
            <p>" + strContent + "</p>   \
        </div>                          \
    ";
    var cssBubble ={
        "position": "absolute",
        "left": arrayPosition[0],
        "top":  arrayPosition[1],
        "color": "#7A4018",
    };
    $("body").append(htmlBubble);
    $("#bubble").css(cssBubble);
}

function deleteBubble(){
    $("#bubble").remove();
}
