const express =require('express')
const passport=require('passport')
const cors = require('cors')
const app= express()
const server= require('http').Server(app)
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
require('./passport-setup')
const io=require('socket.io')(server)
const { v4: uuidV4 } = require('uuid') //to generate dynamic url
app.set('view engine', 'ejs') // to render our front end pages,Files from views directory will be rendered
app.use(express.static('public')) //we will keep all static front-end files like javascript and css here in this folder. this function makes them accessible
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieSession({
    name: 'gmeet',
    keys: ['key1', 'key2']
  }))

  const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
    res.render('home')
})




app.get('/meeting',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})  //This tells server that on getting request through path '/' do the function written inside

app.get('/failed', (req,res)=>{
    res.send('Login Failed')
})

app.get('/good',isLoggedIn, (req,res)=>{
    res.redirect('/meeting')
})

app.get('/logout',(req,res)=>{
  req.session=null;
  req.logout();
  res.render('logout')
})


app.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    
    res.redirect('/good');
  });

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room})
})
io.on('connection', socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).emit('user-connected',userId)

        socket.on('message', (message) => {
          //send message to the same room
          io.to(roomId).emit('createMessage', message)
      }); 
      socket.on('stroke', coordinates => {
        //send message to the same room
          io.to(roomId).emit('draw', coordinates)
        //console.log(coordinates.m,coordinates.n);
        
    }); 

        socket.on('disconnect',()=>{ 
         socket.to(roomId).emit('user-disconnected',userId)
        })
               

    })
})
server.listen('3000')