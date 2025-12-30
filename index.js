const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// enable CORS
app.use(cors());

// all variables defined in the env file will 
// be available in the process.env variable
require('dotenv').config();

// enable express receiving JSON
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ROUTES BEGIN ///////////////////////////////////////////////////////////////

// route: a pairing between an URL and a function
// when the server recieves a request for the URL, the function will execute
app.get('/live', function (req, res) {
    res.send("Hello World");
})

app.get('/welcome', function (req, res) {
    res.send("Welcome!");
});

app.get('/goodbye', function (req, res) {
    res.send("Goodbye");
});

app.get('/api/places/search', async function (req, res) {
    const query = req.query;
    const options = {
        "params": query,
        "headers": {
            "Authorization": "Bearer " + process.env.FSQ_API_KEY,
            "Accept": "application/json",
            "X-Places-Api-Version": "2025-06-17"
        }
    }
    const response = await axios.get("https://places-api.foursquare.com/places/search", options);
    // console.log(response.data);
    // send back the data in JSON data
    res.json(response.data);
});

// app.post('/deepseek/chat/completions', function (req, res) {
//     const mockData = {
//         "text": "Here are some peaceful, accessible spots perfect for grandparents near Marina Bay, Singapore: Gardens by the Bay offers shaded paths and air-conditioned conservatories, Singapore River Cruise provides relaxed sightseeing from the water, the Asian Civilisations Museum showcases cultural artifacts in a cool indoor space, Singapore Botanic Gardens features tranquil orchid displays in lush surroundings, and scenic Merlion Park has flat paths with iconic photo opportunities.",
//         "locations": [
//             {
//                 "name": "Gardens by the Bay",
//                 "lat": 1.2816,
//                 "lng": 103.8636,
//                 "description": "Elder-friendly gardens with shaded paths, wheelchair access, and temperature-controlled conservatories showcasing rare plants.",
//                 "website_url": "https://www.gardensbythebay.com.sg",
//                 "address": "18 Marina Gardens Dr, Singapore 018953"
//             },
//             {
//                 "name": "Singapore River Cruise (Clarke Quay)",
//                 "lat": 1.29,
//                 "lng": 103.8459,
//                 "description": "Gentle 40-minute boat ride with boarding assistance available. Offers seated sightseeing of historic quays and modern landmarks.",
//                 "website_url": "https://www.singapore-river-cruise.com",
//                 "address": "Clarke Quay Jetty, Singapore 059817"
//             },
//             {
//                 "name": "Asian Civilisations Museum",
//                 "lat": 1.2875,
//                 "lng": 103.8513,
//                 "description": "Accessible museum with benches throughout. Focuses on Asian cultures through artifacts in climate-controlled galleries.",
//                 "website_url": "https://www.acm.org.sg",
//                 "address": "1 Empress Pl, Singapore 179555"
//             },
//             {
//                 "name": "Singapore Botanic Gardens",
//                 "lat": 1.3151,
//                 "lng": 103.8162,
//                 "description": "UNESCO site with flat walking trails and National Orchid Garden featuring senior-friendly benches in shaded areas.",
//                 "website_url": "https://www.nparks.gov.sg/sbg",
//                 "address": "1 Cluny Rd, Singapore 259569"
//             },
//             {
//                 "name": "Merlion Park",
//                 "lat": 1.2868,
//                 "lng": 103.8545,
//                 "description": "Iconic waterfront spot with barrier-free access, wide pathways, and seated viewing areas overlooking Marina Bay.",
//                 "website_url": null,
//                 "address": "One Fullerton, Singapore 049213"
//             }
//         ]
//     }
//     res.json(mockData);
// })

app.post('/deepseek/chat/completions', async function (req, res) {
    // get the user message 
    const userMessage = req.body.userMessage;
    const systemMessage = req.body.systemMessage;
    const content = {
        "model": "tngtech/deepseek-r1t2-chimera:free",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant that only responds with a RAW JSON object.Do not include any explanation, markdown, additional text or code fences.Give me the result as a JSON object. " + systemMessage
            },
            {
                "role": "user",
                "content": userMessage
            }
        ]
    }
    const options = {
        "headers": {
            "Authorization": "Bearer " + OPENROUTER_API_KEY,
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", content, options);
    const aiMessage = response.data.choices[0].message.content;

    // Remove markdown code fence markers (```json and ```) with regular expressions
    let stripped = aiMessage.replace(/^```json\s*/i, '').replace(/\s*```$/, '');

    // Also handle potential whitespace variations
    stripped = stripped.trim();

    res.json(JSON.parse(stripped));

})

// NO ROUTES AFTER app.listen() ///////////////////////////////////////////////

// app.listen starts a new server 
// the first parameter is the PORT number
// the PORT number identifies the process (software) that is sending out 
// or recieving traffic
// A port number cannot be used by two process at the same time
app.listen(3001, function () {
    console.log("Server is running")
});
