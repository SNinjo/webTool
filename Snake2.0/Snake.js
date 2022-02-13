// 範圍為 X: 0 ~ iRangeX   Y: 0 ~ iRangeY
var iRangeX = 0;
var iRangeY = 0;
var iMultiple = 100; // 格子轉 px 的倍率

var clock = -1; // 未執行時為 -1
var iTimer = 0;
var iRate = 200; // 執行速率(毫秒)

var a2Map = []; // 0 apple   >= 1 snake
var a2ChangeMap = [];
var aColor = ["#808080", "red", "blue"]; // 根據 Map 的值決定顏色
var strApplePosition = "";
var aSnake = [0];

$(document).ready(function() {

    console.log("connect")//
    iRangeX = parseInt(document.body.clientWidth / iMultiple) - 1;
    iRangeY = parseInt(document.body.clientHeight * 0.95 / iMultiple) - 1; // 須扣除 height of header 
    a2Map = array2_create(iRangeY + 1, iRangeX + 1);

    buildPixels();

    aSnake.push( new Snake(1, "0_0", (iRangeX + "_" + iRangeY), iRate) );
    aSnake.push( new Snake(2, iRangeX + "_0", (iRangeX + "_" + iRangeY), iRate) );
    a2Map[0][0] = 1;
    a2Map[0][iRangeX] = 2;
    displayScreen();

})

function buildPixels() {
    for (var y = 0; y <= iRangeY; y++){
        for (var x = 0; x <= iRangeX; x++){
            $("#range").append("<div id='pixel_" + x + "_" + y + "' class='snake' style='left: " + (x * iMultiple) + "; top: " + (y * iMultiple) + "'></div>");
        }
    }
}

function displayScreen() {
    for (var x = 0; x <= iRangeX; x++){
        for (var y = 0; y <= iRangeY; y++){
            $("#pixel_" + x + "_" + y).css("background-color", aColor[a2Map[y][x]]);
        }
    }
}


function Timer(){
    iTimer++;
    generateApple();
    snakeScript();
    displayScreen();
}

function snakeScript() {
    var a2ChangeInfo = [0]; // [[新增位置, 刪除位置], [新增位置', 刪除位置'] ... ]   -1 代表 GG中
    a2ChangeMap = array2_create(iRangeY + 1, iRangeX + 1);
    // 先去尾
    for (var ID = 1; ID < aSnake.length; ID++){
        a2ChangeInfo.push(aSnake[ID].excute());
        if (a2ChangeInfo[ID] == -1) continue;

        // 吃蘋果不去尾
        if (strApplePosition == a2ChangeInfo[ID][0]){
            aSnake[ID].eatApple(a2ChangeInfo[ID][1]);
            strApplePosition = "";
            $("#apple").css("z-index", 1);
        }
        else a2Map[ getCoordinate("y", a2ChangeInfo[ID][1]) ][ getCoordinate("x", a2ChangeInfo[ID][1]) ] = 0;
    }

    /* 多蛇碰撞系統要重寫 */

    // 再新增頭
    for (var ID = 1; ID < aSnake.length; ID++){
        if (a2ChangeInfo[ID] == -1) continue;

        // 碰撞判斷
        var iMapValue = a2Map[ getCoordinate("y", a2ChangeInfo[ID][0]) ][ getCoordinate("x", a2ChangeInfo[ID][0]) ];
        if ((iMapValue != 0)){
            var aRemovePosition = aSnake[iMapValue].collide(a2ChangeInfo[ID][0]);
            a2ChangeInfo[iMapValue] = -1; // 變更狀態為 GG
            
            console.log("Enter- " + ID)//
            console.log(a2Map)//
            console.log(aRemovePosition)//
            Start_Pause()//
            // 雙頭互撞
            if (aRemovePosition == 0) {
                aRemovePosition = [];
                
                // 長度與 GG的關係
                if ((aSnake[ID].iLength == 1) && (aSnake[iMapValue].iLength != 1)){
                    array_add(aRemovePosition, aSnake[ID].dead());
                    a2ChangeInfo[ID] = -1;
                }
                else if ((aSnake[ID].iLength != 1) && (aSnake[iMapValue].iLength == 1)){
                    array_add(aRemovePosition, aSnake[iMapValue].dead());
                }
                else {
                    array_add(aRemovePosition, aSnake[ID].dead());
                    array_add(aRemovePosition, aSnake[iMapValue].dead());
                    a2ChangeInfo[ID] = -1;
                }
            }
            
            for (var index = 0; index < aRemovePosition.length; index++){
                a2Map[ getCoordinate("y", aRemovePosition[index]) ][ getCoordinate("x", aRemovePosition[index]) ] = 0;
            }
        }

        if (a2ChangeInfo[ID] != -1) a2Map[ getCoordinate("y", a2ChangeInfo[ID][0]) ][ getCoordinate("x", a2ChangeInfo[ID][0]) ] = ID;
    }
}


function generateApple(){
    if (strApplePosition != "") return;
    var aApplePosition = [];
    // 不生成在 snake 中
    while (true){
        aApplePosition = [getRandomInt(iRangeX), getRandomInt(iRangeY)];
        if (a2Map[aApplePosition[1]][aApplePosition[0]] == 0) break;
    }
    $("#apple").css({"left": aApplePosition[0] * iMultiple + 10, "top": aApplePosition[1] * iMultiple + 10, "z-index": 3});
    strApplePosition = aApplePosition[0] + "_" + aApplePosition[1];
}


function setKeyEvent(e){

    if (e.key == "w") {
        aSnake[1].setDirection(0);
    }
    else if (e.key == "s") {
        aSnake[1].setDirection(2);
    }
    else if (e.key == "a") {
        aSnake[1].setDirection(3);
    }
    else if (e.key == "d") {
        aSnake[1].setDirection(1);
    }

    if (e.key == "ArrowUp") {
        aSnake[2].setDirection(0);
    }
    else if (e.key == "ArrowDown") {
        aSnake[2].setDirection(2);
    }
    else if (e.key == "ArrowLeft") {
        aSnake[2].setDirection(3);
    }
    else if (e.key == "ArrowRight") {
        aSnake[2].setDirection(1);
    }

    if (e.key == "p") Start_Pause();

}

function Start_Pause(){
    if (clock == -1) {
        clock = setInterval(Timer , iRate);
        $("#btnControl").val("Pause");
        $("body").focus();
    }
    else {
        clearInterval(clock);
        clock = -1;
        $("#btnControl").val("Start");
    }
}


function Ajax(){
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080",
        dataType: "text",
        data: {
            d: 12,
            c: 566
        },
        success: function (response) {
            console.log(response);
        },
        error: function (thrownError) {
            console.log("Error- Ajax failure");
            console.log(thrownError);
        }
    });
}

function test(){
    Timer();
}
