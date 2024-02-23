const axios = require("axios").default;
const express=require('express');
const bodyparser=require('body-parser')
const session=require('express-session')
app=express()
port=3004;

app.set('view engine','ejs');


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
}));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.render("home", { generatedText: req.session.generatedText });
});


app.post("/text", async (req, res) => {
    try {
        const options = {
            method: "POST",
            url: "https://api.edenai.run/v2/text/chat",
            headers: {
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjgyYmMzMDItNDA5OC00MDgyLWI4NmQtODI3ZDgwNjMzZWY0IiwidHlwZSI6ImFwaV90b2tlbiJ9.h0fV0VOjjaP4jFPHpCSyVCCubXUgHdYwKdiMBORKSs8",
            },
            data: {
                providers: "openai",
                text: req.body.text,
                chatbot_global_action: "social media post generator",
                previous_history: [],
                temperature: 1, // Adjust temperature to control randomness of generated text
                fallback_providers: "",
            },
        };

        const response = await axios.request(options);
        console.log(response.data.openai.generated_text);

        req.session.generatedText = response.data.openai.generated_text;
    } catch (error) {
        console.error(error);
    }

    res.redirect('/');
});

app.listen(process.env.PORT || port, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
