require('../index.html');
import { getColorFromNumber } from "./utils";
import { randomIntFromRange } from "./utils";
import { Res } from "./res";

console.log(document);

let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')
let nodeSize = 128;

let cameraOffset = { 
    x: window.innerWidth/2, 
    y: window.innerHeight/2 
}

let nGold = 0;
let nFood = 0;
let nWater = 0;

let cameraZoom = 1;
let MAX_ZOOM = 5;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;
let fieldX = 30;
let fieldY = 30;
let allRes = [];
let curResId;

setTimeout(tacts,1000);

for (let iy = 0; iy < fieldY; iy = iy +2){
    for ( let ix = 0; ix < fieldX; ix = ix +2) {

      let rIFR = randomIntFromRange(1,5);

      addRes(nodeSize * ix          ,  nodeSize * iy            , iy*fieldX         + ix         , rIFR);
      addRes(nodeSize * ix          ,  nodeSize * (iy + 1)      , iy*fieldX         + ix +1      , rIFR);
      addRes(nodeSize * (ix + 1)    ,  nodeSize * iy            , (iy + 1) *fieldX  + ix         , rIFR);
      addRes(nodeSize * (ix + 1)    ,  nodeSize * (iy + 1)      , (iy + 1) *fieldX  + ix +1      , rIFR);

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
    	
	for (let iy = 0; iy < fieldY; iy ++){
		for (let ix = 0; ix < fieldX; ix ++) {
        let id = iy*fieldX + ix;


        if (allRes[id].open == false){
            ctx.fillStyle =  "grey";
        } else{
            ctx.fillStyle = getColorFromNumber(allRes[id].type);
        }
           
        
        drawRect(nodeSize * ix, nodeSize * iy, nodeSize + 2, nodeSize + 2);

        ctx.fillStyle = "black";
        drawCircle(nodeSize * ix, nodeSize * iy, allRes[id].level * 10);

        ctx.setLineDash([4, 4]);
        drawCircle(nodeSize * ix, nodeSize * iy, 20, 0, 1);
        

		}
	}


	/*
    ctx.fillStyle = "#991111"
    drawRect(-50,-50,100,100)
    
    ctx.fillStyle = "#eecc77"
    drawRect(-35,-35,20,20)
    drawRect(15,-35,20,20)
    drawRect(-35,15,70,20)
    
    ctx.fillStyle = "#fff"
    drawText("Simple Pan and Zoom Canvas", -255, -100, 32, "courier")
    
    ctx.rotate(-31*Math.PI / 180)
    ctx.fillStyle = `#${(Math.round(Date.now()/40)%4096).toString(16)}`
    drawText("Now with touch!", -110, 100, 32, "courier")
    
    ctx.fillStyle = "#fff"
    ctx.rotate(31*Math.PI / 180)
    
    drawText("Wow, you found me!", -260, -2000, 48, "courier")
    */
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

function onPointerDown(e)
{
    isDragging = true
    dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x
    dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y



    let worldCordinate = {x: dragStart.x, y: dragStart.y};
    let gridCoordinate = {x: worldCordinate.x, y: worldCordinate.y};
    gridCoordinate.x = Math.floor(gridCoordinate.x / nodeSize);
    gridCoordinate.y = Math.floor(gridCoordinate.y / nodeSize);
    
    curResId = gridCoordinate.y * fieldX + gridCoordinate.x;

    let nodeCoordinate = {x: worldCordinate.x, y: worldCordinate.y};
    nodeCoordinate.x = gridCoordinate.x * nodeSize;
    nodeCoordinate.y = gridCoordinate.y * nodeSize;

    let distanceToCorner = Math.hypot(worldCordinate.x - nodeCoordinate.x, worldCordinate.y - nodeCoordinate.y);
    //curNodeId = 


    console.log(curResId, gridCoordinate,  allRes[curResId].color, distanceToCorner);

    let htmlRes = document.getElementById("resItem");
    let villageName = document.getElementById("village");
    villageName.innerHTML = "Resourcen Id: " + curResId + "<br>" + "Siedlungslevel: " + allRes[curResId].level;


    if (allRes[curResId].open == true) {
        htmlRes.innerHTML = allRes[curResId].color;
    }else{
        htmlRes.innerHTML = "hidden";
    }
}



function buildUp() {
    allRes[curResId].level++;

}



function onPointerUp(e)
{
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom
}

function onPointerMove(e)
{
    if (isDragging)
    {
        cameraOffset.x = getEventLocation(e).x/cameraZoom - dragStart.x
        cameraOffset.y = getEventLocation(e).y/cameraZoom - dragStart.y
    }
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
            cameraZoom -= zoomAmount
        }
        else if (zoomFactor)
        {
            console.log(zoomFactor)
            cameraZoom = zoomFactor*lastZoom
        }
        
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM )
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM )
        
        console.log(zoomAmount)
    }
}

canvas.addEventListener('mousedown', onPointerDown)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvas.addEventListener('mouseup', onPointerUp)
canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY))
document.getElementById("btnBuildUp").addEventListener("click", buildUp);

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
   console.log("HALLLO");
   // Gehe alle Siedlungen durch
   setTimeout(tacts, 1000);
}