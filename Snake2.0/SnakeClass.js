class Snake {
    constructor(ID, strOrigin, strMapSize, iRate) {
        this.ID = ID;
        this.aPosition = [strOrigin]; // [Tail, Body ... , Head]
        this.strOrigin = strOrigin;
        this.iDirection = 0; // 0上 1右 2下 3左
        this.lastDirection = -1;
        this.iLength = 1;
        this.iDeadTime = 0;
        this.iRevivalTime = 5000 / iRate; // 多少毫秒復活
        this.strMapSize = strMapSize;
    }

    excute() {
        if (this.iDeadTime != 0) {
            this.iDeadTime--;
            return -1;
        }

        // Head
        var strNewPosition = this.moveForward(this.aPosition[this.aPosition.length - 1]);
        this.aPosition.push(strNewPosition);

        // Tail
        var strRemovePosition = this.aPosition.shift();

        // update state to map
        return [strNewPosition, strRemovePosition];
    }

    moveForward(strPosition){
        this.lastDirection = this.iDirection;
        var aPosition = [getCoordinate("x", strPosition), getCoordinate("y", strPosition)];
        // 可能重複碰撞 (回復上一步並順時鐘轉向再前進)
        while (true){
            if      (this.iDirection == 0) aPosition[1] -= 1;
            else if (this.iDirection == 1) aPosition[0] += 1;
            else if (this.iDirection == 2) aPosition[1] += 1;
            else if (this.iDirection == 3) aPosition[0] -= 1; 

            if      (aPosition[0] < 0) aPosition[0] = 0;
            else if (aPosition[0] > getCoordinate("x", this.strMapSize)) aPosition[0]--;
            else if (aPosition[1] < 0) aPosition[1] = 0;
            else if (aPosition[1] > getCoordinate("y", this.strMapSize)) aPosition[1]--;
            else return aPosition[0] + "_" + aPosition[1]; // 沒有碰撞

            this.iDirection = (this.iDirection + 1) % 4;
        }
    }

    eatApple(strGrowPosition) {
        this.aPosition.unshift(strGrowPosition); // 從尾巴成長
        this.iLength++;
        console.log(this.ID + " eat Apple!")//
        console.log(" len- " + this.iLength)//
    }

    collide(strCollisionPosition) {
        var iCollisionIndex = array_indexOf(strCollisionPosition, this.aPosition);
        var aRemovePosition = [];

        if (iCollisionIndex == (this.iLength - 1)) {
            return 0; // 0 代表 雙頭碰撞
        }
        else {
            console.log(this.ID + " collide!")//
            console.log(" index-" + iCollisionIndex)//
            aRemovePosition = array_copy(this.aPosition, 0, iCollisionIndex + 1);
            this.aPosition = array_copy(this.aPosition, iCollisionIndex + 1);
            this.iLength -= iCollisionIndex + 1;
            console.log(" len- " + this.iLength)//
        }
        return aRemovePosition;
    }

    dead() {
        console.log("Snake " + this.ID + " is dead.")//
        var aRemovePosition = this.aPosition;
        this.aPosition = [this.strOrigin];
        this.iDirection = 0;
        this.lastDirection = -1;
        this.iLength = 1;
        this.iDeadTime = this.iRevivalTime;
        return aRemovePosition;
    }

    setDirection(iNewDirection){
        // 不能急轉彎、倒退
        if ((iNewDirection == 0) && (this.lastDirection != 2)){
            this.iDirection = 0;
        }
        else if ((iNewDirection == 2) && (this.lastDirection != 0)){
            this.iDirection = 2;
        }
        else if ((iNewDirection == 3) && (this.lastDirection != 1)){
            this.iDirection = 3;
        }
        else if ((iNewDirection == 1) && (this.lastDirection != 3)){
            this.iDirection = 1;
        }
    }
    
}
