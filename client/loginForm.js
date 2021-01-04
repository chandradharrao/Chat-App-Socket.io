const socket = io();
var username = null;
var roomName = null;

function handleLoginEnter() {
    username = document.getElementById("user_name").value;
    var elements = document.getElementsByClassName("roomName");
    for(let radio = 0;radio<elements.length;radio++){
        if(elements[radio].checked){
            roomName = elements[radio].value;
        }
    }

    //emit an event of submission of form to the server
    if(username!=null){
        socket.emit("login",{username:username,roomName:roomName});
    }
    else{
        alert("Enter valid Username")
    }
}

//redirect to the chat page
socket.on("redirection",(data)=>{
    window.location.href = data.dest;
})

document.getElementById("enter").addEventListener("click",handleLoginEnter)