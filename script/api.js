const gun = Gun(['https://gun-manhattan.herokuapp.com/gun']);
const gameName = "fritz"


function getSecretID()
{
    const n = localStorage.getItem("SID") || Math.random();
    localStorage.setItem("SID", n);
    return n;
}
const secretID = getSecretID();


function roomExists(roomID)
{
    return gun.get("wordgame/rooms/").get(roomID).get("started").once(logRoom)
}

function createRoom()
{
    roomID = parseInt(Math.random() * 100000)
    gun.get(gameName + "/rooms/").get(roomID).get("started").put(false)
    return roomID;
}


function logRoom(data, key)
{
    console.log(data!=null)
    console.log(data)
}





function start(roomID)
{
    gun.get(gameName + "/rooms/").get(roomID).get("started").put(true)
    setRound(0)
}



function writePlayerSlot(roomID, Words)
{
    console.log("WRITING PLAYERSLOTS")
    gun.get(gameName + "/rooms/").get(roomID).get("started").once(function(data, key) {
        if (data==null || data) {return; }
        for(var i = 0;  i < 5; i++)
        {
            gun.get(gameName + "/rooms/").get(roomID).get("players").get(secretID).get(i).put(Words[i])
        }
    })
}




function loadAllPlayerSentences(roomID,callback)
{
    gun.get(gameName + "/rooms/").get(roomID).get("players").map().once(callback)
}








function subscribeRoomEvents(roomID, onStartChange)
{
    gun.get(gameName + "/rooms/").get(roomID).get("started").on(onStartChange);
}

