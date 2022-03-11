var WordInputs = document.getElementsByClassName("inputField")

const Container = document.getElementById("wordContainer");
const gameStateWordDiv = document.getElementById("gamestate_word");
const gameStateGameDiv = document.getElementById("gamestate_game");
const dbutton = document.getElementById("endbtn")


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (!urlParams.has("create")){
    dbutton.style.visibility = "hidden"
}

const roomID = parseInt(urlParams.get("roomID"));
var PlayerWordMap = {}

document.getElementById("RoomID").innerHTML = "Raum ID: " + roomID


var Round = 0;
var started = false;

function UpdateInputs(data, key)
{
    WordInputs[parseInt(key)].value = key
}

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
        console.log(PlayerWordMap)
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
    console.log(playerMap)
    var keyList = []
    for (key in playerMap)
    {
        console.log(key)
        keyList.push(key)
    }
    keyList = keyList.sort(function(a, b) {
        return a - b;
      });
    console.log(keyList)
    var d = []
    keyList.forEach(key => {
        console.log(key + "->" + d)

        d.push(playerMap[key])
    })
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




loadPlayerSlot(roomID, UpdateInputs)
subscribeRoomEvents(roomID, onStartChange);
