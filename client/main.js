//initialize the socket object
const socket = io();

//grab the url which has the form data as a query string
var url = window.location.href;
console.log(url);
var query = url.split("?")[1].split("&");
var username_arr = query[0].split("=");
var username = username_arr[1];
var roomname_arr = query[1].split("=");
var roomName = roomname_arr[1];
console.log(username,roomName);
//send the username to server
socket.emit("user_details",{username:username,roomName:roomName});

//listen for events
socket.on("message",(data)=>{
    const div = document.createElement("div");
    div.innerHTML = data.message;
    document.body.appendChild(div);
});

socket.on("broadcast",(data)=>{
    const div = document.createElement("div");
    div.innerHTML = `@${data.dateTime} ` + `${data.username} : ` + data.message;
    document.body.appendChild(div);
})

//function to handle change in input data
function handleSubmit() {
    const data = document.getElementById("chat-input").value;
    if(data === "Enter Something"){
        alert("Enter Something to send :)");
    }
    else{
        //emit event when user types in a message
        //get the time and date of etered message
        const currDate = new Date();
        let dateTime = `${currDate.getDate()}/${currDate.getMonth() + 1}/${currDate.getFullYear()} ${currDate.getHours()}:${currDate.getMinutes()}`;
        console.log(dateTime);

        socket.emit("chat-typed",{chat_content:data,chat_dateTime:dateTime});
        document.getElementById("chat-input").value = "Enter Something";
    }
}
document.getElementById("enter").addEventListener("click",handleSubmit);
