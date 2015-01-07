//Important Variables
var cardText = ['Take a break', 'Rest your eyes', 'Grab a snack', 'Drink water', 'Neck stretch', 'Back stretch', 'Take a stroll', 'Your prompt'];
var defaultCard = new cardData(1,1,0,5,false);
var cardList = {};
var key = "card"+defaultCard.cardID;
cardList[key] = defaultCard;
console.log(cardList);

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
    $(".card:first-child").find('time-select').val(cardDataObj.hour);
    $(".card:first-child").append("<h3 class='fsmall cardMinute'>5 minutes</h3>");
    if (cardDataObj.repeat) {
        $(".card:first-child").append("<input class='onRepeat active' type='button' value='Repeat'>");        
    } else {
        $(".card:first-child").append("<input class='onRepeat' type='button' value='Repeat'>");  
    }
    $(".card:first-child").append("<input type='range' class='dSlider cardSlider' min='1' max='59' value='"+cardDataObj.min+"'>");
}

$(document).ready(function(){
    
    //Check for Local Storage
    if(typeof(Storage) !== "undefined") {
        
        //TODO LOAD IN INFORMATION AND SET VALUES FOR EVERYTHING
        
    } else {
        
        swal({   title: "Uh Oh",
                 text: "Local storage is not supported on your browser!\nYour settings will not be saved.",
                 type: "error",
                 confirmButtonText: "Okay" });
    }
    
    //Enable everything
    document.getElementById("switch").checked = true;
    
    //Toggle Disable
    var thingsToDisable = ".image,.onRepeat,#fab,.dSlider,select,.btn";
    
    $("#switch").change(function(){
        if ($(this).is(':checked')) {
        $(thingsToDisable).removeAttr('disabled', 'disabled');
        } else {
            $(thingsToDisable).attr('disabled', 'disabled');
        }
    });
    
    //Listen to Content
    
    $('#reminderCards').on('change','.time-select', function() {
                //yeaaah do that
                alert($(this).parent().attr('id'));
                alert($(this).val()); //WORKS
    });
    $('#reminderCards').on('change','.cardSlider', function() {
                //find cardid set as key and store in key
                alert($(this).parent().attr('id'));
                alert($(this).val()); //WORKS
    });
    $('#container').on('click', '#fab', function() {
        if ($("#fab").attr("disabled") != "disabled"){
            //create this key and load in errthang
            var newDataKey = $('#reminderCards').children().attr('id');
            alert(newDataKey); //works
        }
    });
    $('#reminderCards').on('click', '.btn-alert', function() {
        //find this key and delete it
        alert($(this).parent().attr('id')); //WORKS
    });
    $('#reminderCards').on('click', '.btn', function() {
        //find this key and capture msg
        alert($(this).parent().attr('id'));
        cardList[$(this).parent().attr('id')].custMsg =
            prompt("Remind yourself", "Custom message here");
        
        alert(cardList[$(this).parent().attr('id')].custMsg);
    });
      $("#reminderCards").on('click', '.onRepeat', function(){
     //if class == onRepat then toggle repeat to true
        //else toggle repeat to false
        alert($(this).parent().attr('id'));
        alert($(this).attr('class')); //Works
      });
    
    $("#reminderCards").on('click', '.image', function(){
        if ($(".image").attr("disabled") != "disabled"){
            //take img value and store it
            alert($(this).parent().attr('id'));
            alert(parseInt(($(this).attr('class').split(' ').pop()).substring(3,4)));
        }
    });
    
    //Add New Card
    
    var id = 1;
    
    $("#fab").click(function(){
        if ($("#fab").attr("disabled") != "disabled"){
            id++;
            defaultCard.cardID = id;
            defaultCard.imgNum = 2;
            addCard(defaultCard);
            key = "card"+id;
            cardList[key] = defaultCard;
            console.log(cardList[key]);
        }
    });
    
    $("#reminderCards").on('click','.btn-alert', function() {
        key = "card"+($(this).parent().attr('id').match(/\d+/)[0]);
        delete cardList[key];
        
        $(this).parent().remove();
    });
    
    //Intensity Setting
    var intensityValues = ['Subtle','Aparent','Obvious','Urgent'];
    var intensity = 1;

    $("#slider").on('input', function(){
        intensity = $('#slider').val();
        if (intensity < 25) {
            $("#intensityStatus").html(intensityValues[0]);
        } else if (intensity < 50) {
            $("#intensityStatus").html(intensityValues[1]);
        } else if (intensity < 75) {
            $("#intensityStatus").html(intensityValues[2]);
        } else {
            $("#intensityStatus").html(intensityValues[3]);
        } 
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
$(this).parent().find(".cardType").replaceWith("<input class='btn message' type='button' value='Your prompt'>")
            }
            if (imgNum > 7){
                imgNum = 0;
            }
        $(this).parent().find(".cardType").html(cardText[imgNum]+" in");
        $(this).removeClass(lastClass);
        $(this).addClass("img"+(imgNum+1).toString());
        }
    });
    
});
