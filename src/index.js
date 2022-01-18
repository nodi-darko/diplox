require('../index.html');
import { getColorFromNumber } from "./utils";
import { randomIntFromRange } from "./utils";
import { Res } from "./res";

console.log(document);

let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')
let nodeSize = 128;

let cameraOffset = { x: window.innerWidth,  y: window.innerHeight * 0.8 }
let mousePos = {x: 0, y: 0}

let cameraZoom = 0.2;
let MAX_ZOOM = 5;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;
let field = {x: 30, y:30};
let allRes = [];
let selectedResId = undefined;
let capitalCityID = undefined;
let curResPos = {x:0, y:0};
let bank = [0, 100, 100, 100, 100];

setTimeout(tacts,1000);

for (let iy = 0; iy < field.y; iy = iy +2){
    for ( let ix = 0; ix < field.x; ix = ix +2) {

      let rIFR = randomIntFromRange(1,5);

      addRes(nodeSize * ix          ,  nodeSize * iy            , iy*field.x         + ix         , rIFR);
      addRes(nodeSize * ix          ,  nodeSize * (iy + 1)      , iy*field.x         + ix +1      , rIFR);
      addRes(nodeSize * (ix + 1)    ,  nodeSize * iy            , (iy + 1) *field.x  + ix         , rIFR);
      addRes(nodeSize * (ix + 1)    ,  nodeSize * (iy + 1)      , (iy + 1) *field.x  + ix +1      , rIFR);

    }
}

function render()
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    ctx.scale(cameraZoom, cameraZoom)
    ctx.translate(cameraOffset.x, cameraOffset.y)
    //ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
    	
	for (let iy = 0; iy < field.y; iy ++){
		for (let ix = 0; ix < field.x; ix ++) {
            let id = iy*field.x + ix;


            if (allRes[id].open == false){
                ctx.fillStyle =  "grey";
            } else{
                ctx.fillStyle = getColorFromNumber(allRes[id].type);
            }
            
            
            drawRect(nodeSize * ix, nodeSize * iy, nodeSize + 2, nodeSize + 2);

            if (id == capitalCityID){
                ctx.fillStyle = "red";
            }else{
                ctx.fillStyle = "black";
            }
            ctx.setLineDash([]);
            drawCircle(nodeSize * ix, nodeSize * iy, allRes[id].level * 10, 1, 1);

            ctx.setLineDash([4, 4]);
            drawCircle(nodeSize * ix, nodeSize * iy, 40, 0, 1);

            if (allRes[id].level >= 3 && allRes[id].level <= 5) {
                ctx.font = "50px Arial";
                ctx.fillText("🏘️", nodeSize * ix - (allRes[id].level * 10), nodeSize * iy);
            }else{
                if (allRes[id].level >= 6) {
                    ctx.font = "80px Arial";
                    ctx.fillText("🏙️", nodeSize * ix - (allRes[id].level * 10), nodeSize * iy);    
                }
            }
		}
	}

    drawCircle(curResPos.x * nodeSize, curResPos.y * nodeSize, 20, 0, 1);

    requestAnimationFrame( render )
}

function drawCircle(x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    if (stroke) {
      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
  }

// Gets the relevant location from a mouse or single touch event
function getEventLocation(e)
{
    if (e.touches && e.touches.length == 1)
    {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY)
    {
        return { x: e.clientX, y: e.clientY }        
    }
}

function drawRect(x, y, width, height)
{
    ctx.fillRect( x, y, width, height )
}

function drawText(text, x, y, size, font)
{
    ctx.font = `${size}px ${font}`
    ctx.fillText(text, x, y)
}

let isDragging = false
let dragStart = { x: 0, y: 0 }

function screenToWorld(p) {
    return {x: p.x/cameraZoom - cameraOffset.x, y: p.y/cameraZoom - cameraOffset.y};
}

function worldToGrid(p) {
    return {x: Math.floor(p.x / nodeSize), y: Math.floor(p.y / nodeSize)};
}

function gridToId(p) {
    return p.y * field.x + p.x;
}

function idToGrid(id) {
    let xp =  Math.floor(id / field.x);
    return {x: xp, y: id - xp * field.x};
}
//If mouse is pressed down
function onPointerDown(e)
{
    isDragging = true
    dragStart = screenToWorld(getEventLocation(e));

    let worldCordinate = {x: dragStart.x, y: dragStart.y};
    let gridCoordinate = {x: worldCordinate.x, y: worldCordinate.y};
    gridCoordinate = worldToGrid(gridCoordinate);
    
    selectedResId = gridToId(gridCoordinate);

    let nodeCoordinate = {x: worldCordinate.x, y: worldCordinate.y};
    nodeCoordinate.x = gridCoordinate.x * nodeSize;
    nodeCoordinate.y = gridCoordinate.y * nodeSize;

    let distanceToCorner = Math.hypot(worldCordinate.x - nodeCoordinate.x, worldCordinate.y - nodeCoordinate.y);

    console.log(selectedResId, gridCoordinate,  allRes[selectedResId].color, worldCordinate.x);

    let htmlRes = document.getElementById("resItem");

    if (allRes[selectedResId].open == true) {
        htmlRes.innerHTML = allRes[selectedResId].color;
    }else{
        htmlRes.innerHTML = "hidden";
    } 
}




function buildVillage(){
    let waterAmount = 30;
    if(allRes[selectedResId].villageBank[3] - waterAmount >= 0 && allRes[selectedResId].level <= 9){
        allRes[selectedResId].villageBank[3] -= waterAmount;
        allRes[selectedResId].level++;
    }else{
        if (allRes[selectedResId].villageBank[3] - waterAmount >= 0) {
            alert ("Die Stadt kann nicht noch größer werden")
        }else{
            alert ("Nicht genug Wasser")
        }
    }

}

function capCityMaker (){
    if (selectedResId != undefined) {capitalCityID = selectedResId;}
}

function MoveResLinks() {
    if (selectedResId != undefined) {
        allRes[selectedResId].villageBank[2]--;
        allRes[selectedResId-1].villageBank[2]++;
        allRes[selectedResId].order.push( {from: selectedResId, to: selectedResId - 1, res: 2, anzahl: 1} )
    }
}

function MoveResRechts() {
    if (selectedResId != undefined) {
        allRes[selectedResId].villageBank[2]--;
        allRes[selectedResId+1].villageBank[2]++;

    }
}

function MoveResUnten() {
    if (selectedResId != undefined) {
        allRes[selectedResId].villageBank[2]--;
        allRes[selectedResId + canvas.width].villageBank[2]++;

    }
}

function MoveResOben() {
    if (selectedResId != undefined) {
        allRes[selectedResId].villageBank[2]--;
        allRes[selectedResId - canvas.width].villageBank[2]++;

    }
}

function onPointerUp(e)
{
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom
}

function onPointerMove(e)
{
    if (isDragging && e && getEventLocation(e))
    {
        cameraOffset.x = getEventLocation(e).x/cameraZoom - dragStart.x
        cameraOffset.y = getEventLocation(e).y/cameraZoom - dragStart.y
    }
    mousePos.x =  getEventLocation(e).x;
    mousePos.y =  getEventLocation(e).y;
    let mouseWorldPos = screenToWorld(mousePos);
    mouseWorldPos.x += nodeSize * 0.5;
    mouseWorldPos.y += nodeSize * 0.5;

    curResPos = worldToGrid(mouseWorldPos);
}

function handleTouch(e, singleTouchHandler)
{
    if ( e.touches.length == 1 )
    {
        singleTouchHandler(e)
    }
    else if (e.type == "touchmove" && e.touches.length == 2)
    {
        isDragging = false
        handlePinch(e)
    }
}

let initialPinchDistance = null
let lastZoom = cameraZoom

function handlePinch(e)
{
    e.preventDefault()
    
    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
    
    if (initialPinchDistance == null)
    {
        initialPinchDistance = currentDistance
    }
    else
    {
        adjustZoom( null, currentDistance/initialPinchDistance )
    }
}

function adjustZoom(zoomAmount, zoomFactor)
{
    if (!isDragging)
    {
        if (zoomAmount)
        {
            console.log(cameraZoom, zoomAmount)
            cameraZoom -= zoomAmount
        }
        else if (zoomFactor)
        {
            console.log(zoomFactor)
            cameraZoom = zoomFactor*lastZoom
        }
        
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM )

        cameraOffset.x += (mousePos.x / cameraZoom) - (mousePos.x / (cameraZoom + zoomAmount));
        cameraOffset.y += (mousePos.y / cameraZoom) - (mousePos.y / (cameraZoom + zoomAmount));
    }
}

canvas.addEventListener('mousedown', onPointerDown)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvas.addEventListener('mouseup', onPointerUp)
canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY))
document.getElementById("btnBuildUp").addEventListener("click", buildVillage);
document.getElementById("btnCapCity").addEventListener("click", capCityMaker);
document.getElementById("btnMoveResLinks").addEventListener("click", MoveResLinks);
document.getElementById("btnMoveResOben").addEventListener("click", MoveResOben);
document.getElementById("btnMoveResRechts").addEventListener("click", MoveResRechts);
document.getElementById("btnMoveResUnten").addEventListener("click", MoveResUnten);



// Ready, set, go
render()

function addRes(posX, posY, newId, t)
{
    let nodePosX = posX / nodeSize;
    let nodePosY = posY / nodeSize;

    // Add resource
    let r = new Res(newId, posX, posY, t, 1000);
    allRes[newId] = r;
}

function tacts()
{
   //console.log("HALLO");
   
	for (let iy = 0; iy < field.y; iy ++){
		for (let ix = 0; ix < field.x; ix ++) {
            let id = iy*field.x + ix;
            let currentLevel = allRes[id].level
            if (currentLevel >= 1) {
                allRes[id].villageBank[2]--;
                let currentType = allRes[id].type;
                
                allRes[id].villageBank[currentType] += currentLevel;
                if (allRes[id - 1])           allRes[id].villageBank[allRes[id - 1].type]           += allRes[id].level;
                if (allRes[id - field.x])     allRes[id].villageBank[allRes[id - field.x].type]     += allRes[id].level;
                if (allRes[id - field.x -1])  allRes[id].villageBank[allRes[id - field.x -1].type]  += allRes[id].level;
                
                if(allRes[id].villageBank[2] <= 0 && allRes[id].level >= 1) {
                    alert ("Siedlung zerstört");
                    allRes[selectedResId].level--;
                    allRes[id].villageBank[2] += 100;

                }else{
                    if (allRes[selectedResId].order.length >= 0) {
                        for(let a = 0; a < allRes[selectedResId].order.length; a++){
                            allRes[selectedResId].villageBank[allRes[selectedResId].order[a].res] -= allRes[selectedResId].order[a].anzahl;
                            allRes[allRes[selectedResId].order[a].to].villageBank[allRes[selectedResId].order[a].res] += allRes[selectedResId].order[a].anzahl;
                        }
                    }
                }

                        
                
            }
            if (currentLevel) {
                let currentType = allRes[id].type;
                bank[currentType] += currentLevel;
                if(allRes[id - 1])  bank[allRes[id - 1].type]  += allRes[id].level;
                if(allRes[id - field.x])  bank[allRes[id - field.x].type]  += allRes[id].level;
                if(allRes[id - field.x -1])  bank[allRes[id - field.x -1].type]  += allRes[id].level;

            }
        }
    }




    if(bank[2] <= 0) {
        alert ("Game over");
    }else{
        // Gehe alle Siedlungen durch
        setTimeout(tacts, 1000);
    }

    if (selectedResId != undefined) {
        let villageName = document.getElementById("village");
        villageName.innerHTML =  "Resourcen Id: "   + selectedResId                        + "<br>" + "Siedlungslevel: " + allRes[selectedResId].level;
        villageName.innerHTML += "<br>" + "Futter:" + allRes[selectedResId].villageBank[2] + "<br>" + "Wasser:" + allRes[selectedResId].villageBank[3];
        villageName.innerHTML += "<br>" + "Land:"   + allRes[selectedResId].villageBank[4] + "<br>" + "Gold:"   + allRes[selectedResId].villageBank[1];
    }

    if (capitalCityID != undefined) {
        bank[1] = allRes[capitalCityID].villageBank[1];
        bank[2] = allRes[capitalCityID].villageBank[2];
        bank[3] = allRes[capitalCityID].villageBank[3];
        bank[4] = allRes[capitalCityID].villageBank[4];
    }
    document.getElementById("btnGold").innerHTML   = "Gold   (" + bank[1] + ")";
    document.getElementById("btnFutter").innerHTML = "Futter (" + bank[2] + ")";
    document.getElementById("btnWasser").innerHTML = "Wasser (" + bank[3] + ")";
    document.getElementById("btnLand").innerHTML   = "Land   (" + bank[4] + ")";
}