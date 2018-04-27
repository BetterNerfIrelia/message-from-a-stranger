// nothing here yet


var sendMessage = document.getElementById("send-message-button");


var moodeins = document.getElementById("moodeins");
var moodzwei = document.getElementById("moodzwei");
var mooddrei = document.getElementById("mooddrei");

console.log(sendMessage);

sendMessage.onclick = clickListener;

    function clickListener() {
    console.log("Button clicked");
        console.log(document.getElementById("message-input").value)
        var messageInput = document.getElementById("message-input").value;

        var messageObject = {"message":messageInput};
        var messageJSON = JSON.stringify(messageObject);


        var reqListener = console.log(this.responseText);
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("POST", "/send-message");
        oReq.send(messageJSON);
        }





