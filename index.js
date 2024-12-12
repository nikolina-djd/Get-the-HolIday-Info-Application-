import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port =  3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

 app.get("/", (req, res)=>{
   res.render("index.ejs")
 })

//Post Request for Awailable Countries and Their Codes
app.post("/getCountryAndCode", async(req, res)=>{
    try { const response = await axios.get("https://date.nager.at/api/v3/AvailableCountries")
    const result = response.data;
    
    console.log(result)
    const getCountryOptions = req.body["Choose_a_Country"]
    function getFields(input, field) {
        var output = [];
        for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
        return output;
}
    const arrayOfCountries = getFields(result, "name")
    const arrayofCodes = getFields(result, "countryCode")
    const combine = arrayOfCountries.map((value, index) => (["Country: " + value + ";  Country Code: " + arrayofCodes[index]+";"]))
    res.render("index.ejs", {
    getCountryList: getCountryOptions,
    countriesAndCodes: combine,
    
 })
 console.log(result.name)
} catch (error) {
res.render("index.ejs", {error: error.response.message})   
}
})

//Get Request for Public Holidays of a Country for a given year and country-code;
app.post("/getPublicHolidays", async(req, res)=>{
try {
    const year = req.body["year"];
    const countryCode = req.body["countryCode"];
    const responseTwo =  await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
    const arrayOfPublicHolidays = responseTwo.data;
    console.log(arrayOfPublicHolidays)
    res.render("index.ejs", {
    arrayOfPublicHolidays: arrayOfPublicHolidays,
    
    })
} catch (error) {
    res.render("index.ejs", {error: error.message})   
}
})
  //Get the next Public Holiday for a given Country Code;
  app.post("/getNextPublicHolidays", async(req, res)=>{
try {
    
    const countryCodeforNextPublicHoliday = req.body["countryCodeforNextPublicHoliday"];
    const responseThree =  await axios.get(`https://date.nager.at/api/v3/NextPublicHolidays/${countryCodeforNextPublicHoliday}`)
    const arrayOfNextPublicHolidays = responseThree.data; 
    res.render("index.ejs", {
    arrayOfNextPublicHolidays: arrayOfNextPublicHolidays,
    })
} catch (error) {
    res.render("index.ejs", {error: error.message})   
}
})
   
//Server ranner
app.listen(port, ()=>{
console.log(`Server is running on port ${port}`)
})