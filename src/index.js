const express = require('express');
const app = express();
const Collection = require('./mongo');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');


const path = require('path');
const collection = require('./mongo');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded( { extended: false }));

const templatePath = path.join(__dirname, "../templates");

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static("public"));

async function hashpass(password) {
    const res = await bcrypt.hash(password,10);
    return res;
}

async function compare(userpass, hashpass) {
    const res = await bcrypt.compare(userpass, hashpass);
    return res;
}

app.get("/", (req, res) => {
    if(req.cookies.jwt)
    {
        const verify = jwt.verify(req.cookies.jwt, "mynameisgayathiriiamacloudcomputingstudent")
    res.render("home", {name:verify.name });
    }
    else{
        res.render("login");
    }
})
app.get("/signup", ( req, res ) => {
    res.render("signup");
})

app.post("/signup", async ( req, res ) => {
    try {
        const check = await Collection.findOne( 
        {
            name: req.body.name
        }
        )
        if(check)
        {
            res.send("User already exists");

        }
        else
        {
            const token = jwt.sign( { name: req.body.name}, "mynameisgayathiriiamacloudcomputingstudent")
            
            res.cookie("jwt", token,{
                maxAge: 60,
                httpOnly: true
            })

            const data = {
                name: req.body.name,
                password: await hashpass(req.body.password),
                token: token

            }
            await Collection.insertMany([data])
            res.render("home", { name: req.body.name })
        
            
        }

    }
    catch (error) { 
        console.log("Error", error)
        res.status(400).send("Wrong Data");
    }
    })


    app.post("/login", async ( req, res ) => {
        try {
            const check = await Collection.findOne( { name: req.body.name})
            const passcheck = await compare(req.body.password, check.password)
            
            if(check && passcheck)
            {
                res.cookie("jwt", check.token,{
                    maxAge: 60,
                    httpOnly: true
                })
                res.render("home", { name: req.body.name} )
                
    
            }
            else
            {
                res.send("wrong username or password");
            }
        }
        catch (error) { 
            console.log("Error", error)
            res.status(400).send("Wrong Data");
        }
        })
    
app.listen(3000, () => {
    console.log(" Server is running on port 3000");
})
