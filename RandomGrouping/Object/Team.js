class Team {
    #setTeammate;

    constructor(arrFigureName){
        this.#setTeammate = new Set(arrFigureName);
    }

    static randomGrouping(setFigureList){
        let arrRandomSorted = this.randomSort(Array.from(setFigureList));
        let intHalfQuantity = parseInt(setFigureList.size / 2);

        return [ new Team(arrRandomSorted.slice(0, intHalfQuantity)),  new Team(arrRandomSorted.slice(intHalfQuantity)) ];
    }
    static randomSort(array){
        let arrRandomSorted = [];
        let arrUnselected = array;
        let intUnselectedQuantity = array.length;

        while (intUnselectedQuantity !== 0){
            let strRandomFigureName = arrUnselected[this.getRandomInt(intUnselectedQuantity)];

            arrRandomSorted.push(strRandomFigureName)
            arrUnselected = arrUnselected.filter(function(value){ 
                return value !== strRandomFigureName;
            });

            intUnselectedQuantity--;
        }

        return arrRandomSorted;
    }
    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    addTeammate(strFigureName){
        this.#setTeammate.add(strFigureName);
    }

    getTeammate(){
        return this.#setTeammate;
    }
}