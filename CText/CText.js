$(document).ready(function() {

    $("#article").on('change keyup paste', function() {
        countText();
    });
    
    console.log("ab".match(/`|~|!|@|#|%|\^|&|\*|(|)/g));
})


/* 判定 text
    數字: 0 - 9
    標點符號: `~!@#%^&*()_+-=[]{}\|;:'",./<>?  ，、。！：；「」『』【】
    英文: 空白間隔為一單字
    中文: 剩下一個字元數
*/
function countText(){
    var article = $("#article").val();
   
    $("#numberCounter").val( count(article, /[0-9]/g) );
    article = article.replace(/[0-9]/g, "");

    var allPunctuation = new RegExp(/`|~|!|@|#|%|\^|&|\*|\(|\)|_|\+|-|=|[|]|{|}|\|||;|:|'|"|,|.|\/|<|>|\?|，|、|。|！|：|；|「|」|『|』|【|】/g);
    $("#punctuationCounter").val( count(article, allPunctuation) );
    article = article.replace(allPunctuation, " ");

    console.log(article);
}

function count(string, regex){
    // null.length 會出錯，因此補上: || []
    // regex 斜線後加上 g  代表符合全選
    return (string.match(regex) || []).length;
}
