$(document).ready(function() {

    $("#article").on('change keyup paste', function() {
        countText();
    });

    
    console.log(("An Apple 0 0a h0 09 day.".match(/0|9/g) || []));
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

    
}

function count(string, regex){
    // null.length 會出錯，因此補上: || []
    // regex 斜線後加上 g  代表符合全選
    return (string.match(regex) || []).length;
}
