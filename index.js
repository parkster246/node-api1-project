const express = require("express")
const shortid = require('shortid')
const server = express()

const port = 8000;



server.use(express.json());
server.get('/working', (req ,res )=>{
    res.send('working')
})

let users = [{
    id: shortid.generate(), // hint: use the shortid npm package to generate it
    name: "Joey", // String, required
    bio: "From Friends",
}, {
    id:shortid.generate(),
    name:"Chandler",
    bio:"From Friends"
}]

server.post('/users', (req,res) => {
    const user = req.body
    if( !user.name  || !user.bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else if (user === undefined){
        res.status(500).json({errorMessage: "There was an error while saving the user to the database"})
    }else {
    user.id = shortid.generate()
    users.push(user)
    res.status(201).json(user)
    }
})

server.get('/users', (req,res) => {
    if(users.length === 0 || users === undefined ){
        res.status(500).json( { errorMessage: "The users information could not be retrieved." })
   } else{
       res.status(200).json(users)
   }
})

server.get('/users/:id', (req,res) => {
    const {id} = req.params
    user = users.filter(  u => u.id === id)

    if( user.length === 0){
         res.status(404).json({ message: "The user with the specified ID does not exist." })
    }else if(user === undefined){
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })

    }else {
        res.status(200).json(user)
    }

})

server.delete("/users/:id", (req,res) => {
    const {id} = req.params
    users = users.filter(  u => u.id !== id)
    if (!users) {
        res.status(500).json({
            errorMessage: "The user could not be removed"
        })
    } 

    if(!users.id ){
        res.status(404).json({message: "The user with the specified ID does not exist."});
    }else{
        res.status(204).end()
    }       
})
server.put("/api/users/:id", (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    if (!users) {
        res.status(500).json({
            errorMessage: "The user information could not be modified"
        })
    } else {
        if (changes.name === undefined && changes.bio === undefined) {
            res.status(400).json({
                errorMessage: 'Please provide name and bio for the user.'
            })
        } else {
            let found = users.find(u => u.id === id);

            if (found) {
                Object.assign(found, changes);
                res.status(200).json(found);
            } else {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            }
        }
    }
}); 

server.listen(port, () => console.log("server running..."))