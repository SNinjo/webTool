// 範圍為 X: 0 ~ iRangeX   Y: 0 ~ iRangeY
var iRangeX = 0;
var iRangeY = 0;
var iMultiple = 100; // 格子轉 px 的倍率

var clock = -1; // 未執行時為 -1
var iTimer = 0;

var iDirection = 0; // 0上 1右 2下 3左
var lastDirection = -1;
var iHeadNumber = 0;
var iTailNumber = 0;
var iSnakeLength = 1;
var aSnakePosition = [[0, 0]];
var aApplePosition = -1;

var a2Map = [];

$(document).ready(function() {

    console.log("connect")//
    iRangeX = parseInt(document.body.clientWidth / iMultiple) - 1;
    iRangeY = parseInt(document.body.clientHeight * 0.95 / iMultiple) - 1; // 須扣除 height of header 
    a2Map = createArray2(iRangeX + 1, iRangeY + 1);

})

function createArray2(row, column){
    var array = [], temp = [];
    for (var i = 0; i < column; i++){
        for (var j = 0; j < row; j++){
            temp.push(0);
        }
        array.push(temp);
        temp = [];
    }
    return array;
}


function Timer(){
    iTimer++;
    generateApple();
    snakeScript();
}

function snakeScript(){
    // head
    iHeadNumber++;
    var aHeadPosition = aSnakePosition[aSnakePosition.length - 1];
    aHeadPosition = moveForward([aHeadPosition[0], aHeadPosition[1]]);
    $("#range").append('<div id="snake_' + iHeadNumber + '" class="snake" style="left: ' + (aHeadPosition[0] * iMultiple) + '; top: ' + (aHeadPosition[1] * iMultiple) + ';"></div>');

    aSnakePosition.push([aHeadPosition[0], aHeadPosition[1]]);  // deep copy 避免複製物件
    lastDirection = iDirection;
    

    // length
    if (equalArray(aHeadPosition, aApplePosition)){
        iSnakeLength++;
        aApplePosition = -1;
    }


    // tail
    while ((iHeadNumber - iTailNumber + 1) > iSnakeLength) removeTail();


    // body
    if (a2Map[aHeadPosition[1]][aHeadPosition[0]] == 1){
        var index = indexOf_Array2(aSnakePosition, aHeadPosition);
        while (index-- >= 0){
            removeTail();
            iSnakeLength--;
        }
    }
    else a2Map[aHeadPosition[1]][aHeadPosition[0]] = 1;
}

function removeTail(){
    var aTailPosition = aSnakePosition.shift();
    a2Map[aTailPosition[1]][aTailPosition[0]] = 0;
    $("#snake_" + iTailNumber).remove();
    iTailNumber++;
}

function equalArray(array01, array02){
    if (array01.length != array02.length) return false;
    for (var index = 0; index < array01.length; index++){
        if (array01[index] != array02[index]) return false;
    }
    return true;
}

function indexOf_Array2(array, target){
    for (var index = 0; index < array.length; index++){
        if (equalArray(array[index], target)) return index;
    }
    return -1;
}


function moveForward(aPosition){
    // 可能重複碰撞 (回復上一步並順時鐘轉向再前進)
    while (true){
        if (iDirection == 0) aPosition[1] -= 1;
        else if (iDirection == 1) aPosition[0] += 1;
        else if (iDirection == 2) aPosition[1] += 1;
        else if (iDirection == 3) aPosition[0] -= 1; 

        if (aPosition[0] < 0) aPosition[0] = 0;
        else if (aPosition[0] > iRangeX) aPosition[0]--;
        else if (aPosition[1] < 0) aPosition[1] = 0;
        else if (aPosition[1] > iRangeY) aPosition[1]--;
        else return aPosition; // 沒有碰撞

        iDirection = (iDirection + 1) % 4;
    }
}


function generateApple(){
    if (aApplePosition != -1) return;
    // 不生成在 snake 中
    while (true){
        aApplePosition = [getRandomInt(iRangeX), getRandomInt(iRangeY)];
        if (a2Map[aApplePosition[1]][aApplePosition[0]] == 0) break;
    }
    $("#apple").css({"left": aApplePosition[0] * iMultiple + 10, "top": aApplePosition[1] * iMultiple + 10});
}

function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}


function setKeyEvent(e){

    // 不能急轉彎、倒退
    if ((e.key == "ArrowUp") && (lastDirection != 2)){
        iDirection = 0;
    }
    else if ((e.key == "ArrowDown") && (lastDirection != 0)){
        iDirection = 2;
    }
    else if ((e.key == "ArrowLeft") && (lastDirection != 1)){
        iDirection = 3;
    }
    else if ((e.key == "ArrowRight") && (lastDirection != 3)){
        iDirection = 1;
    }

    if (e.key == "p") Start_Pause();

}

function Start_Pause(){
    if (clock == -1) {
        clock = setInterval(Timer , 250);
        $("#btnControl").val("Pause");
        $("body").focus();
    }
    else {
        clearInterval(clock);
        clock = -1;
        $("#btnControl").val("Start");
    }
}


function printArray(array){
    var strOutput = "";
    for (var index = 0; index < array.length; index++){
        strOutput += array[index] + " ";
    }
    console.log(strOutput);
}
