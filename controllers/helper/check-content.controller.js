const https = require('https');

const { BASE_MOVIE_API_URL, URL_API_KEY_PARAM } = require('../../config');

module.exports.isSearchIdValid = async ({ searchId, searchType, params }) => {
  console.log('Checking if ' + searchId + ' is a valid ' + searchType);
  let argUrl = BASE_MOVIE_API_URL + '/' + searchType;

  return new Promise((resolve) => {
    let targetUrl = `${argUrl}/${searchId}?${URL_API_KEY_PARAM}${
      params ? `&${params}` : ''
    }`;
    console.log(targetUrl);
    https.get(targetUrl, function (response) {
      let flag = false;
      if (response.statusCode == 200) {
        flag = true;
      }
      resolve(flag);
    });
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
