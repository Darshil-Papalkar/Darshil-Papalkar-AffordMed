const axios = require('axios');
const express = require('express');

const app = express();
app.use(express.json());


// Problem 1
app.get("/numbers", async (req, res) => {
    const urls = req.query.url;
    const response = urls.map(async (url) => {
        try{
            const resp = await axios.get(url, {
                timeout: 500,
            });
            return resp.data.numbers;
        }
        catch(err){
            console.log(err.message);
        }
    });

    const result = await Promise.all(response);
    const ans = [...new Set(result.flat().filter(num => !isNaN(num) && num))].sort((a, b) => a-b);
    res.send(ans);
});


// Problem 2
app.get("/prefixes", async (req, res) => {
    const keywords_array = ['bonfire', 'cardio', 'case', 'character', 'bonsai'];
    const keywords = req.query.keywords.split(',').map(item => item.trim());

    const getPrefix = (keyword) => {
        let code = "";
        for(let i = 0; i < keyword.length; i++){
            const arr = keywords_array.filter(item => item.includes(keyword.substring(0, i)));
            if(arr.length > 1) code += keyword[i];
            else break;
        }
        return code;
    };

    const result = keywords.map(keyword => {
        const index = keywords_array.findIndex((item) => item === keyword);
        if(index === -1)
            return {
                "keyword": keyword,
                "status": "not_found",
                "prefix": "not_applicable"
            }
        else{
            const prefix = getPrefix(keyword);
            return {
                "keyword": keyword,
                "status": "found",
                "prefix": prefix
            };
        }
    })
    
    res.send(result);
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Started ${port}`);
});