//TODO

// Fix up the if elif cases for storage updates
// Test alpha

'use strict';

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

function updateAlarm(){
    var changeKey = localStorage.getItem("justChanged");
        if (cardList[changeKey].repeat){
            chrome.alarms.create(changeKey, {
                delayInMinutes: parseFloat((cardList[changeKey].hour)*60+cardList[changeKey].min),
                periodInMinutes: parseFloat((cardList[changeKey].hour)*60+cardList[changeKey].min)
            });
                console.log(changeKey);
        } else {
            chrome.alarms.create(changeKey, {
                //delayInMinutes: parseFloat(((cardList[changeKey].hour)*60+cardList[changeKey].min)/60)
               delayInMinutes: parseFloat((cardList[changeKey].hour)*60+cardList[changeKey].min)
            });
            
        }
}

function deleteAlarm() {
    var changeKey = localStorage.getItem("justChanged");
    chrome.alarms.clear(changeKey);
}

function addAlarms(){
    chrome.alarms.getAll(function(alarms){console.log("THESES ARE ALARmS "+alarms.length)});
    console.log("Alarms On");
    for(var each in cardList) {
        console.log(cardList[each]);

        if (cardList[each].repeat){
            console.log(parseFloat((cardList[each].hour)*60+cardList[each].min));
            chrome.alarms.create(each, {
                delayInMinutes: parseFloat((cardList[each].hour)*60+cardList[each].min),
                periodInMinutes: parseFloat((cardList[each].hour)*60+cardList[each].min)
            });
                console.log("easy");
        } else {
            console.log(parseFloat((cardList[each].hour)*60+cardList[each].min));
            chrome.alarms.create(each, {
                //delayInMinutes: parseFloat(((cardList[each].hour)*60+cardList[each].min)/60)
                delayInMinutes: parseFloat((cardList[each].hour)*60+cardList[each].min)
            });
            
        }
    }

    chrome.alarms.onAlarm.addListener(function(alarm) {
        
        console.log("name of alarm "+alarm.name);
        
        console.log("adding a listener");
        chrome.alarms.getAll(function(alarms){console.log(alarms.length)});

        if(cardList[alarm.name].imgNum == 8){
            chrome.notifications.create('Reminder',{type: 'basic', iconUrl: cardImage[cardList[alarm.name].imgNum-1], title: 'Reminder', message:cardList[alarm.name].custMsg},function(notificationID){});
        } else {
            chrome.notifications.create('Reminder',{type: 'basic', iconUrl: cardImage[cardList[alarm.name].imgNum-1], title: 'Reminder', message:cardText[cardList[alarm.name].imgNum-1]},function(notificationID){});
        }
    });
}

function toggle(){
        if (localStorage.getItem("toggleOn") > 0) {
        chrome.browserAction.setBadgeText({text: "On"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#00FF00"});
        addAlarms();
        chrome.alarms.getAll(function(alarms){console.log(alarms.length)});
    } else {
        chrome.browserAction.setBadgeText({text: "Off"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
        
        chrome.alarms.getAll(function(alarms){console.log(alarms.length)});
        chrome.alarms.clearAll(function(wasCleared){console.log(wasCleared)});
        console.log("Remove Alarms");
        chrome.alarms.getAll(function(alarms){console.log(alarms.length)});
    } 
}

function onStorageEvent(storageEvent) {
    console.log(storageEvent.key);
    if (storageEvent.key == "intensity") {
        intensity = localStorage.getItem("intensity");
    }
    else if (storageEvent.key == "action"){
        if(localStorage.getItem("action") == "newData") {
            updateAlarm();
        }
        else if(localStorage.getItem("action") == "dataChange") {
            deleteAlarm();
            updateAlarm();
        }
        else /*if (localStorage.getItem("action") == "delete")*/ {
            deleteAlarm();     
        }
    }
    else if (storageEvent.key == "justChanged") {
        if (localStorage.getItem("action") == "newData") {
            updateAlarm();
        } else if (localStorage.getItem("action") == "changeData") {
            deleteAlarm();
            updateAlarm();
        } else {
            deleteAlarm(); 
        }
    }
    else if (storageEvent.key == "data") {
        deleteAlarm();
        updateAlarm();
    }
    else /*(storageEvent.key == "toggleOn")*/ {
        if (localStorage.getItem("toggleOn") == 2) {
            var cardList = JSON.parse(localStorage.getItem("data"));
            console.log(cardList);
        }
        toggle();
        
    } 
}

var intensity = 12;
var cardText = ['Take a break', 'Rest your eyes', 'Grab a snack', 'Drink water', 'Neck stretch', 'Back stretch', 'Take a stroll', 'Your prompt'];
var flag = true;
var cardImage = [ "./images/clock4.png", "./images/eye106.png", "./images/chocolate5.png", "./images/water42.png", "./images/user91.png", "./images/stretching1.png", "./images/walker.png", "./images/calendar146.png"];

var cardList = JSON.parse(localStorage.getItem("data"));
console.log(cardList);

toggle();

window.addEventListener("storage", onStorageEvent);



