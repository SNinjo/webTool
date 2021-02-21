$(document).ready(function() {

    console.log("connect")//

})


var position = [0, 0];
function setKeyEvent(e){

    console.log(e.key);//

    if (e.key == "ArrowLeft"){
        position[0] -= 100;
    }
    else if (e.key == "ArrowRight"){
        position[0] += 100;
    }
    else if (e.key == "ArrowUp"){
        position[1] -= 100;
    }
    else if (e.key == "ArrowDown"){
        position[1] += 100;
    }

    if (position[0] < 0) position[0] = 0;
    else if ((position[0] + 100) > document.body.clientWidth) position[0] -= 100;
    if (position[1] < 0) position[1] = 0;
    else if ((position[1] + 100) > document.body.clientHeight) position[1] -= 100;
    $("#snake_0").css({left: position[0], top: position[1]});

    console.log(position)//
}