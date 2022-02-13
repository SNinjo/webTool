/* 更改名單的位置 */
let setFigureList = new Set([
    "default_player01",
    "default_player02",
    "default_player03",
    "default_player04",
    "default_player05",
    "default_player06",
    "default_player07",
    "default_player08",
    "default_player09",
    "default_player10",
]);




/* 更改預設輸入名單的位置 */
let strDefaultFigureList = `
player01 進入組隊房間
player02 進入組隊房間
player03 進入組隊房間
player04 進入組隊房間
player05 進入組隊房間
player06 進入組隊房間
player07 進入組隊房間
player08 進入組隊房間
player09 進入組隊房間
player10 joined the room.
`;




/* 讀取 LOL的聊天室訊息 */
let setStrLOLJoinedMessages = new Set([
    "進入組隊房間",
    "joined the room.",
]);

function getFigureListByLOLChatroomMessage(strMessages){
    setFigureList.clear();
    
    strMessages.split("\n").forEach(strMessage => {
        if (!isLOLJoinedMessages(strMessage)) return;

        setFigureList.add(strMessage.substring(0, strMessage.indexOf(" ")));
    });
}
function isLOLJoinedMessages(strMessage){
    let isLOLJoinedMessages = false;
    
    setStrLOLJoinedMessages.forEach(strLOLJoinedMessage => {
        if (isLOLJoinedMessages) return;
        if (strMessage.indexOf(strLOLJoinedMessage) !== -1) isLOLJoinedMessages = true;
    });
    return isLOLJoinedMessages;
}


/* 選擇人物名單 */
let setSelectedFigureList = new Set([]);

function reverseFigureSelectedState(tagFigureCheckbox){
    let strSelectedFigureName = tagFigureCheckbox.value;

    if (setSelectedFigureList.has(strSelectedFigureName)){
        setSelectedFigureList.delete(tagFigureCheckbox.value);
    }
    else {
        setSelectedFigureList.add(tagFigureCheckbox.value);
    }
}


/* 隊伍名單 */
let teamRed;
let teamBlue;
