$(document).ready(function(){
    
    //Toggle Disable
    var thingsToDisable = ".image,.onRepeat,#fab,.dSlider,select,.btn";
    
    $(thingsToDisable).attr('disabled', 'disabled');
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
    $('#reminderCards').on('click', '.btn', function() {
        //find this key and delete it
        alert($(this).parent().attr('id')); //WORKS
    });
    $('#reminderCards').on('click', '.onRepeat', function() {
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
    
    //Add New Card -- TODO run a for loop to initialize hourSelect
    var cardImg = "<div class='image img1'></div>";
    var cardType = "<h2 class='fmedium cardType'>Take a Break in</h2>";
    var hourSelect = "<select class='time-select'>" +
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
        "<option value='12'>12 hours</option></select>";
    var cardMin = "<h3 class='fsmall cardMinute'>5 minutes</h3>";
    var repeatBtn = "<input class='onRepeat' type='button' value='Repeat'>";
    var cardSlider = "<input type='range' class='dSlider cardSlider' min='1' max='59' value='5'>";
    var exitBtn = "<input class='btn btn-alert btn-sm' type='button' value='X'>";
    
    var i = 1;
    
    $("#fab").click(function(){
        if ($("#fab").attr("disabled") != "disabled"){
            i++;
            $("#reminderCards").prepend($("<div/>", {id: "card"+i, class: "card"}));
            $(".card:first-child").append(exitBtn);
            $(".card:first-child").append(cardImg);
            $(".card:first-child").append(cardType);
            $(".card:first-child").append(hourSelect);
            $(".card:first-child").append(cardMin);
            $(".card:first-child").append(repeatBtn);
            $(".card:first-child").append(cardSlider);
            
        }
    });
    
    $("#reminderCards").on('click','.btn', function() {
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
    
    var cardText = ['Take a Break','Rest Your Eyes','Grab a Snack','Drink Water','Stretch Your Neck','Stretch Your Back','Take a Stroll','Custom Prompt'];
    
    $("#reminderCards").on('click', '.image', function(){
        if ($(".image").attr("disabled") != "disabled"){
            var lastClass = $(this).attr('class').split(' ').pop();
            var imgNum = parseInt(lastClass.substring(3,4));
            if (imgNum > 7){
                imgNum = 0;
            }
            $(this).parent().find(".cardType").html(cardText[imgNum]+" in");
            $(this).removeClass(lastClass);
            $(this).addClass("img"+(imgNum+1).toString());
        }
    });
    
});
