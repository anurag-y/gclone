console.log("Board Script");
canvas = document.getElementById("white");
let test = document.getElementById("test");
function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}
var chatWindow = document.querySelector('.chat-window');
function scrollChatToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;
 let ctx = canvas.getContext("2d");

var p;
var q;
let coordinates={m:0,n:0}
let mouseDown= false;
let newStroke = true;
// window.onmousedown=(e)=>{
//     ctx.moveTo(p,q);
//     socket.emit('mousedown',{p,q});
//     mouseDown = true;
// }

window.onmousedown = (e) => {
    ctx.beginPath(); // Start a new path for each stroke
    p = e.clientX;
    q = e.clientY;
    coordinates.m = p;
    coordinates.n = q;
    ctx.moveTo(p, q);
    mouseDown = true;
  };

window.onmouseup=(e)=>{
    mouseDown = false;
    newStroke = true;
}
///////********************************************************************** */



const socket= io('/')
const videoGrid = document.getElementById('video-grid') //we place our video in this element
var msg;
//Peer js library helps connect to different users
const myPeer= new Peer(undefined,{
    host: '/',
    port:'3001'
})

myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)
})

const myVideo= document.createElement('video')
myVideo.muted=true      // So that we don't listen to our own video
const peers={}  //An object to store peers we are connecting to

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    //answer the call when a new user joins
    myPeer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        setTimeout(connectToNewUser, 1000, userId, stream)
        console.log('User connected: ' + userId)
    })


    const element = document.getElementById("chat");
    msg=document.getElementById('chat')
    element.addEventListener("keypress", function(event) {
        
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            event.stopPropagation();
            //console.log("enter pressed")  
            if(msg.value.length!=0)
            {             
             socket.emit('message', msg.value)
             msg.value='';         
             
            }                      

        }
       

});

////////////////////////////////// ##### For Invite sending ########## ////////////////////////

const inmail = document.getElementById("invite");

inmail.addEventListener("keypress", function(event) {  

    if (event.key === "Enter") {
        var mail=document.getElementById('invite').value; 
        var dummy=document.getElementById('invite');       
        const content={address: mail, txt: "You are Invited to meeting room: "+ window.location.href}
        event.preventDefault();
        event.stopPropagation();
        if(mail.length!=0)
        {         
         socket.emit('mail', content)
         dummy.value='';
        }
        else
        {
            alert("Please enter a valid email address");
        }
      }
   

});




////////////////////////////////// ##### For Invite sending ########## ////////////////////////




//For board ###################

// window.onmousemove=(e)=>{
//     p=e.clientX;
//     q=e.clientY;
//     coordinates.m=p;
//     coordinates.n=q;
//     if(mouseDown){
//         socket.emit('stroke',coordinates);
//     }
    
    
// }

window.onmousemove = (e) => {
    p = e.clientX;
    q = e.clientY;
    coordinates.m = p;
    coordinates.n = q;
    if (mouseDown) {
        if(newStroke){
            socket.emit('newStroke', coordinates);
            newStroke = false;
        }
      socket.emit('stroke', coordinates);
    }
  };
   
})

socket.on("createMessage", message => {
    console.log(message)
    var el = document.getElementById("messages");
    var node = document.createElement("li");
    node.innerText=message;
    el.appendChild(node);
    scrollChatToBottom()
    return ;
   })
   socket.on("newStroke", coordinates => {
    ctx.beginPath();
    ctx.moveTo(coordinates.m, coordinates.n);
    });




   socket.on("draw", (coordinates) => {
    console.log(coordinates.m, coordinates.n);
    ctx.lineTo(coordinates.m, coordinates.n);
    ctx.stroke();
    });

socket.on('user-connected',userId=>
{
    console.log('user-connected: '+userId)
})
socket.on('user-disconnected',userId=>{
    if(peers[userId]) peers[userId].close()  //If a peer disconnects remove his video from the screen
})



function connectToNewUser(userId,stream)
{
    const call=myPeer.call(userId, stream)
    const video=document.createElement('video')
    call.on('stream', userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close',()=>{
        video.remove()
    })

    peers[userId]=call  //userId getting stored in the object
}

function addVideoStream(video , stream){
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}


