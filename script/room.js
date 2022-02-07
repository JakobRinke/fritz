var WordInputs = document.getElementsByClassName("inputField")

const Container = document.getElementById("wordContainer");
const gameStateWordDiv = document.getElementById("gamestate_word");
const gameStateGameDiv = document.getElementById("gamestate_game");
 


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const roomID = parseInt(urlParams.get("roomID"));
var PlayerWordMap = {}

document.getElementById("RoomID").innerHTML = "Raum ID: " + roomID


var Round = 0;
var started = false;



function UpdateWord()
{
    var Words = []
    for (var i = 0; i<5; i++)
    {
        Words.push(WordInputs[i].value.trim())
    }
    writePlayerSlot(roomID, Words)
}


var Sentences = [];
async function onStartChange(data, key)
{
    started = data
    if(started)
    {
        loadAllPlayerSentences(roomID, playerSentenceLoader)

        gameStateGameDiv.classList.add('gamestate_visible');
        gameStateGameDiv.classList.remove('gamestate_invisible');
        
        gameStateWordDiv.classList.add('gamestate_invisible');
        gameStateWordDiv.classList.remove('gamestate_visible');

        await delay(2000)
        onPlayersLoaded()
    }
}




function playerSentenceLoader(data, key)
{
    d = []
    for(var i = 0; i!=5; i++)
    {
        d.push(data[i])
    }
    PlayerWordMap[key] = d;
}


function onPlayersLoaded()
{
    Sentences = sort(generateSentences(convertPlayerMapToList(PlayerWordMap)));
    console.log("Num of Sentences:" + Sentences.length)
    try
    {
        Container.innerHTML = Sentences.join("<br>")
    }
    catch(e)
    {
        Container.innerHTML = "Fehler, Bitte Neutstarten"
    }      
}




function convertPlayerMapToList(playerMap)
{
    var d = []
    for (key in playerMap)
    {
        d.push(PlayerWordMap[key])
    }
    return d
}

function generateSentences(playerList)
{
    var sentences = []
    const playerNum = playerList.length
    var m = 0;
    for (var i = 0; i<playerNum; i++)
    {
        var n = 0;
        var sen = ""
        for (var j = 0; j < 5; j++)
        {
            sen += playerList[m%playerNum][n] + " ";
            m++;
            n++;
        }
        sentences.push(sen);
    }
    return sentences
}





subscribeRoomEvents(roomID, onStartChange);