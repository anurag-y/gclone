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
   
})

socket.on("createMessage", message => {
    console.log(message)
    var el = document.getElementById("messages");
    var node = document.createElement("li");
    node.innerText=message;
    el.appendChild(node);
    return ;
   })

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

// function send(){
//     msg=document.getElementById('chat');
//     console.log(msg.value)
// }

