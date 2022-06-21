const express =require('express')
const app= express()
const server= require('http').Server(app)
const io=require('socket.io')(server)
const { v4: uuidV4 } = require('uuid') //to generate dynamic url
app.set('view engine', 'ejs') // to render our front end pages,Files from views directory will be rendered
app.use(express.static('public')) //we will kee all static front-end files like javascript and css here in this folder. this function makes them accessible


app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})  //This tells server that on getting request through path '/' do the function written inside

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room})
})
io.on('connection', socket=>{
    socket.on('join-room',(roomId,userId)=>{
        console.log(roomId,userId)

    })
})
server.listen('3000')