//Create variables here
var dog, happyDog, database, foods , foodStock;
var dog1,dog2;

var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState
var bedroomImg, gardenImg,washroomImg;
function preload()
{
  //load images here
  dog=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png");

  bedroomImg=loadImage("images/Bed Room.png")
  gardenImg=loadImage("images/Garden.png")
  washroomImg=loadImage("images/Wash Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000, 400);
  

  foodObj=new food();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock)

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  var gameStateRef  = database.ref('gameState');
      gameStateRef.on("value",function(data){
         gameState = data.val();
      })


  
 dog1=createSprite(800,200,30,30)
 dog1.addImage("dog",dog)
 dog1.scale=0.3;
  
 feed=createButton("Feed the Dog");
 feed.position(700,95);
 feed.mousePressed(feedDog)

 addFood=createButton("Add Food");
 addFood.position(800,95);
 addFood.mousePressed(addFoods)
}


function draw() { 
  background(46, 139, 87) 
  currentTime=hour();
  if(currentTime==(lastFed+1)){
  
    // gameState=Playing
     update("Playing")
     foodObj.garden ();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping")
     foodObj.bedroom ();
    // gameState=Sleeping
    
       
   }else if(currentTime>(lastFed+2)&& currentTime <= (lastFed+4)){
     update("Bathing")
     foodObj.washroom ();
   }else {
     update("Hungry")
     foodObj.display()
   }

  fill (255,255,254);
  textSize (15);
  if(lastFed>12){
  text ("Last Feed:"+ lastFed%12+"PM",350,30)
  }else if(lastFed==0){
    text("Last Feed:12 AM",350,30);
}else{
  text("Last Feed:"+lastFed+"AM",350,30)
}
 // if(foods=0){
  //  textSize(20)
  //  fill("black")
  //  noStroke();
  //  text("oh wow! drago finished the milk",300,200)
 // }


 // image(dog,400,500,80,80)

  
   // textSize(15);
 // noStroke();
 // fill ("black");
 // text("food remaining: "+foods,300,250);
 // text("NOTE: Press UP_ARROW Key To Feed Dog Milk!",100,20)
  
  //add styles here

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog1.remove();
  }else{
    feed.show();
    addFood.show();
    dog1.addImage(happyDog)
  }
 

drawSprites();

 


}
function readStock(data){
  foods=data.val();
  foodObj.updateFoodStock(foods)
}
function feedDog(){
  dog1.addImage("happy Dog",happyDog)

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour (),
    gameState:"Hungry"
  })

}

function addFoods(){
 foods++;
 database.ref('/').update({
   Food:foods
 })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}



