const got = require('got');

const { BASE_MOVIE_API_URL, API_KEY } = require('../config');
const { searchIdTypes } = require('../utils/search.types');
const { IMAGE_PATH_BASE_URL } = require('../utils/urls');

//details about TV & movies with trailer and cast&crew
exports.getDetails = async ({ searchId, searchType, params = '' }) => {
  try {
    let response = await this.createRequest({ searchId, searchType, params });
    let data = JSON.parse(response.body);

    //since discover uses getDetails. Hence this
    if (
      searchId === searchIdTypes.DAY ||
      searchId === searchIdTypes.WEEK ||
      searchId === searchIdTypes.MOVIE ||
      searchId === searchIdTypes.TV
    ) {
      //get the required object format
      let resultsList = data.results.map((result) =>
        this.getDetailsResponseObject(result)
      );
      return resultsList;
    } else {
      //if basic movie search get all the details
      let trailer = await this.getTrailer({ searchId, searchType });
      let castnCrew = await this.getCastAndCrew({ searchId, searchType });
      //return in required form
      return { ...this.getDetailsResponseObject(data), ...castnCrew, trailer };
    }
  } catch (error) {
    throw error;
  }
};

//gets trailer of TV or Movie based on searchType
exports.getTrailer = async ({ searchId, searchType }) => {
  try {
    //requests TMDB servesr for trailer for videos
    const response = await this.createRequest({
      searchId,
      searchType,
      requestFor: '/videos',
    });
    //convert reponse to json
    const jsonResponse = JSON.parse(response.body);
    //filters trailer from the code
    return jsonResponse.results.filter((result) => result.type === 'Trailer');
  } catch (error) {
    throw new Error(error);
  }
};

exports.getCastAndCrew = async ({ searchId, searchType }) => {
  //requests TMDB servesr for trailer for credits
  const response = await this.createRequest({
    searchId,
    searchType,
    requestFor: '/credits',
  });
  //convert to json body
  const jsonResponse = JSON.parse(response.body);
  // filter cast lists & return required details
  let castList = jsonResponse.cast.map((member) => ({
    id: member.id,
    character: member.character,
    name: member.name,
    profile_path: `${IMAGE_PATH_BASE_URL}/${member.profile_path}`,
  }));
  // filter crew lists & return required details for onlr producer and 
  let crewList = jsonResponse.crew
    .filter((member) => member.job === 'Producer' || member.job === 'Director')
    .map((member) => ({
      id: member.id,
      character: member.character,
      name: member.name,
      profile_path: `${IMAGE_PATH_BASE_URL}/${member.profile_path}`,
    }));

  let castAndCrewInfo = {
    cast: castList,
    crew: crewList,
  };
  //return object of cast & crew 
  return castAndCrewInfo;
};
//creates request to TMDB API regarding the parameters
exports.createRequest = async ({
  searchId,
  searchType,
  params,
  requestFor = '',// requestFor: videos or credits or anything else
}) => {
  if (!searchId) throw new Error('Search Id not provided');
  if (!searchType) throw new Error('Search type not provided');

  console.log(process.env.MOVIE_DB_API_URL);
//creates requested API url for TMDB API
  let targetUrl =
    BASE_MOVIE_API_URL +
    `/${searchType}/${searchId}${requestFor}?api_key=${API_KEY}${
      params ? `&${params}` : ''
    }`;
  console.log('Getting data from: ' + targetUrl);// just a check

  const responsePromise = got(targetUrl);
  const bufferPromise = responsePromise.buffer();
  const jsonPromise = responsePromise.json();

  const [response] = await Promise.all([
    responsePromise,
    bufferPromise,
    jsonPromise,
  ]);

  return response;
};
//takes in the response from TMDB API & return required parameters editted
exports.getDetailsResponseObject = (responseData) => ({
  ...responseData,
  poster_path: IMAGE_PATH_BASE_URL + responseData.poster_path,
  created_by: responseData.created_by ? responseData.created_by : [],
});
