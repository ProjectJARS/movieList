const https = require("https");
const got = require("got");

const api = process.env.MOVIE_API_KEY;
const apiKey = "?api_key=" + api;
const originalArgUrl = process.env.MOVIE_API_URL;

module.exports.isSearchIdValid = async function (movieId, searchType, params) {
    console.log("Checking if " + movieId + "is a valid " + searchType);
    let argUrl = originalArgUrl + searchType + "/";
    if (params === undefined)
        params = "";
    return new Promise(resolve => {
        let targetUrl = argUrl + movieId + apiKey + params;
        console.log(targetUrl)
        https.get(targetUrl, function (response) {
            let flag = false;
            if (response.statusCode == 200) {
                flag = true;
            }
            resolve(flag);
        })
    });
};

/*try {
        const responsePromise = got(targetUrl);
        const bufferPromise = responsePromise.buffer();
        const jsonPromise = responsePromise.json();
        const [response, buffer, json] = await Promise.all([responsePromise, bufferPromise, jsonPromise,]);
        //console.log("OK");
        return true;
    }
    catch (err) {
        // console.log("NOT OK");
        return false;
    }*/

//335984 ->Blade Runner 2049
//1396 -> Breaking Bad