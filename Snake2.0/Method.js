function array_indexOf(target, array) {
    for (var index = 0; index < array.length; index++) {
        if (array[index] == target) return index;
    }
    return -1;
}

function array_add(array, data) {
    for (var index = 0; index < data.length; index++){
        array.push(data[index]);
    }
    return array;
}

function array_copy(array, intStart, intEnd) {
    if ((intStart == null) || (intStart < 0)) intStart = 0;
    if ((intEnd == null) || (intEnd > array.length)) intEnd = array.length;

    var newArray = [];
    for (var index = intStart; index < intEnd; index++){
        newArray.push(array[index]);
    }
    return newArray;
}

function array_print(array){
    var strOutput = "";
    for (var index = 0; index < array.length; index++){
        strOutput += array[index] + " ";
    }
    console.log(strOutput);
}

function array2_create(row, column){
    var array = [], temp = [];
    for (var i = 0; i < row; i++){
        for (var j = 0; j < column; j++){
            temp.push(0);
        }
        array.push(temp);
        temp = [];
    }
    return array;
}


function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}


// 座標表示法為:  x_y
function getCoordinate(direction, strCoordinate) {
    if (direction == "x"){
        return parseInt((strCoordinate + "").substring(0, strCoordinate.indexOf("_")));
    }
    else if (direction == "y"){
        return parseInt((strCoordinate + "").substring(strCoordinate.indexOf("_") + 1));
    }
    else return null;
}