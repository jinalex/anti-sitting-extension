//TODO

//add in intensity option
//perhaps add in see all alarm status option



//Important Variables
var cardText = ['Take a break', 'Rest your eyes', 'Grab a snack', 'Drink water', 'Neck stretch', 'Back stretch', 'Take a stroll', 'Your prompt'];
var defaultCard = new cardData(1,1,0,5,false);
var cardList = {};
var intensityValues = ['Coming Soon!','Coming Soon!','Coming Soon!','Coming Soon!'];
//var intensityValues = ['Subtle','Aparent','Obvious','Urgent'];
var thingsToDisable = ".image,.onRepeat,#fab,.dSlider,select,.btn";
var intensity = 1;
var id = 0;
var key = "card";

//Constructor for card data
function cardData(cardID, imgNum, hour, min, repeat, custMsg) {
    
    custMsg = (typeof custMsg === 'undefined') ? "Your Custom Message Here" : custMsg;
    
    this.cardID = cardID;
    this.imgNum = imgNum;
    this.hour = hour;
    this.min = min;
    this.repeat = repeat;
    this.custMsg = custMsg;
}

function countElem(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}
  
//check for changes and save
function syncStorage(cardList) {
    // Get a value saved in a form.
    var storedList = JSON.stringify(cardList);
    // Check that there's some code there.
    if (!storedList) {
      alert("error");
      return;
    }
    localStorage.setItem("data", storedList);
    //console.log(JSON.parse(storedList));
  }

//grey-in-out
function toggleDisable(){
        if ($("#switch").is(':checked')) {
            $(thingsToDisable).removeAttr('disabled', 'disabled');
            localStorage.setItem("toggleOn", 1);
        } else {
            $(thingsToDisable).attr('disabled', 'disabled');
            localStorage.setItem("toggleOn", -1);
        }
}

//updates intensity

function howIntense(intensity){
        if (intensity < 25) {
            $("#intensityStatus").html(intensityValues[0]);
            localStorage.setItem("intensity", 12);
        } else if (intensity < 50) {
            $("#intensityStatus").html(intensityValues[1]);
            localStorage.setItem("intensity", 37);
        } else if (intensity < 75) {
            $("#intensityStatus").html(intensityValues[2]);
            localStorage.setItem("intensity", 62);
        } else {
            $("#intensityStatus").html(intensityValues[3]);
            localStorage.setItem("intensity", 87);
        } 
}
    
//Adds a new reminder Card
function addCard(cardDataObj) {
    $("#reminderCards").prepend($("<div/>", {id: "card"+(cardDataObj.cardID), class: "card"}));
    $(".card:first-child").append("<input class='btn btn-alert btn-sm' type='button' value='X'>");
    $(".card:first-child").append("<div class='image img"+cardDataObj.imgNum+"'></div>");
    $(".card:first-child").append("<h2 class='fmedium cardType'>"+cardText[cardDataObj.imgNum-1]+" in</h2>");
    $(".card:first-child").append("<select class='time-select'>" +
        "<option value='0'>------</option>"+
        "<option value='1'>1 hour</option>" +
        "<option value='2'>2 hours</option>"+
        "<option value='3'>3 hours</option>"+
        "<option value='4'>4 hours</option>"+
        "<option value='5'>5 hours</option>"+
        "<option value='6'>6 hours</option>"+
        "<option value='7'>7 hours</option>"+
        "<option value='8'>8 hours</option>"+
        "<option value='9'>9 hours</option>"+
        "<option value='10'>10 hours</option>"+
        "<option value='11'>11 hours</option>"+
        "<option value='12'>12 hours</option></select>");
    
    $(".card:first-child").find('select').val(cardDataObj.hour);
    
    minutes = cardDataObj.min;
        if (minutes == 1) {
           $(".card:first-child").append("<h3 class='fsmall cardMinute'>1 minute</h3>");
        } else {
           $(".card:first-child").append("<h3 class='fsmall cardMinute'>"+cardDataObj.min+" minutes</h3>");
        }
    
    if (cardDataObj.repeat) {
        $(".card:first-child").append("<input class='onRepeat active' type='button' value='Repeat'>");        
    } else {
        $(".card:first-child").append("<input class='onRepeat' type='button' value='Repeat'>");  
    }
    $(".card:first-child").append("<input type='range' class='dSlider cardSlider' min='1' max='59' value='"+cardDataObj.min+"'>");
}

$(document).ready(function(){
    
    if (Notification.permission !== "granted")
    Notification.requestPermission();
    
    //Check for Local Storage
    if(typeof(Storage) !== "undefined") {
        if (localStorage.length != 0){
            cardList = JSON.parse(localStorage.getItem("data"));
            console.log(cardList);
            for (i = 0; i < countElem(cardList); i++){
                id++;
                addCard(cardList["card"+id]);
            }
            intensity = localStorage.getItem("intensity");
            $(".intense").val(intensity);
            howIntense(intensity);
            
            //It is illogical why this piece of code does not work. 
//            alert(localStorage.getItem("toggleOn"));              //Passes false
//            if (localStorage.getItem("toggleOn")){                //Execute in spite of value being false
//                alert(localStorage.getItem("toggleOn"));          //Alert reads out false
//                document.getElementById("switch").checked = localStorage.getItem("toggleOn");     //Some how it is true? I am confused
//            }
            
            //quick fix using numerical values instead of boolean
            if (localStorage.getItem("toggleOn") > 0){
                document.getElementById("switch").checked = true;
            }
            toggleDisable();
            
        } else {
            cardList = {}
            intensity = 1;
            id++;
            defaultCard.cardID = id;
            defaultCard.imgNum = Math.floor((Math.random() * 7) + 1);
            addCard(defaultCard);
            key = "card"+id;
            cardList[key] = defaultCard;
            console.log(cardList);
            
            //toggleOn
            document.getElementById("switch").checked = true;
            toggleDisable();
        }
    } else {
        
        swal({   title: "Uh Oh",
                 text: "Local storage is not supported on your browser!\nYour settings will not be saved.",
                 type: "error",
                 confirmButtonText: "Okay" });
    
    }
    
    //Toggle Disable
    
    $("#switch").change(function(){
        toggleDisable();
    });
    
    //Listen to Card Change
    
    $('#reminderCards').on('change','.time-select', function() {
 cardList[$(this).parent().attr('id')].hour = parseInt($(this).val());
                console.log(cardList);
        localStorage.setItem("action", "dataChange");
        localStorage.setItem("justChanged", $(this).parent().attr('id'));
    });
    
    $('#reminderCards').on('change','.cardSlider', function() {
    cardList[$(this).parent().attr('id')].min = parseInt($(this).val());
        localStorage.setItem("action", "dataChange");
        localStorage.setItem("justChanged", $(this).parent().attr('id'));
    console.log(cardList);
    });
    
    $('#reminderCards').on('click', '.message', function() {
cardList[$(this).parent().attr('id')].custMsg =
            prompt("Remind yourself", "Custom message here");
        
        localStorage.setItem("action", "dataChange");
        localStorage.setItem("justChanged", $(this).parent().attr('id'));
        
        console.log(cardList);
    });
    
      $("#reminderCards").on('click', '.onRepeat', function(){

          if ($(this).attr('class') == "onRepeat")
          {
            cardList[$(this).parent().attr('id')].repeat = true;
              localStorage.setItem("action", "dataChange");
              localStorage.setItem("justChanged", $(this).parent().attr('id'));
          } else {
            cardList[$(this).parent().attr('id')].repeat = false;   
              localStorage.setItem("action", "dataChange");
              localStorage.setItem("justChanged", $(this).parent().attr('id'));
          }

        console.log(cardList);
      });
    
    //Add New Card
    
    $("#fab").click(function(){
        if ($("#fab").attr("disabled") != "disabled"){
            id++;
            var tempCard = new cardData(id,2,0,5,false);
            addCard(tempCard);
            key = "card"+id;
            console.log(tempCard);
            cardList[key] = tempCard;
            localStorage.setItem("action", "newData");
            localStorage.setItem("justChanged", key);
            console.log(cardList);
        }
    });
    
    $("#reminderCards").on('click','.btn-alert', function() {
        key = "card"+($(this).parent().attr('id').match(/\d+/)[0]);
        delete cardList[key];
        localStorage.setItem("action", "delete");
        localStorage.setItem("justChanged", key);
        $(this).parent().remove();
        console.log(cardList);
    });
    
    //Intensity Setting

    $("#slider").on('input', function(){
        intensity = $('#slider').val();
        howIntense(intensity);
    });
    
    //Card Settings
    
    var minutes = 5;
    
    $("#reminderCards").on('input', '.cardSlider', function(){
        minutes = $(this).val();
        if (minutes == 1) {
            $(this).parent().find(".cardMinute").html(minutes+' minute');
        } else {
            $(this).parent().find(".cardMinute").html(minutes+' minutes');
        }
    });
    
    $("#reminderCards").on('click', '.onRepeat', function(){
        if ($(this).hasClass("active")){
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
    });
    
    //Cycle Through Images and Card Types
    
    $("#reminderCards").on('click', '.image', function(){
        if ($(".image").attr("disabled") != "disabled"){
            var lastClass = $(this).attr('class').split(' ').pop();
            var imgNum = parseInt(lastClass.substring(3,4));
            if (imgNum == 7){
$(this).parent().find(".cardType").replaceWith("<input class='message' type='button' value='Your Prompt'>")
            }
            if (imgNum > 7){
                imgNum = 0;
                $(this).parent().find(".message").replaceWith("<h2 class='fmedium cardType'>What is up in</h2>");
            }
        $(this).parent().find(".cardType").html(cardText[imgNum]+" in");
        $(this).removeClass(lastClass);
        $(this).addClass("img"+(imgNum+1).toString());
        cardList[$(this).parent().attr('id')].imgNum = parseInt(($(this).attr('class').split(' ').pop()).substring(3,4));
            localStorage.setItem("action", "dataChange");
            localStorage.setItem("justChanged", $(this).parent().attr('id'));
        console.log(cardList);
        }
    });
    
    $("#container").on('click', function() {
        syncStorage(cardList);
    });
    
    $("#container").on('change', function() {
        syncStorage(cardList);
    });
    
});
