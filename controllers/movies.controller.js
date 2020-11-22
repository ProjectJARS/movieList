const got = require('got');

const { BASE_MOVIE_API_URL, API_KEY } = require('../utils/api');
const { searchIdTypes } = require('../utils/search.types');
const { IMAGE_PATH_BASE_URL } = require('../utils/urls');

exports.getDetails = async ({ searchId, searchType, params = '' }) => {
  let response = await createRequest({ searchId, searchType, params });
  let data = JSON.parse(response.body);
  let trailer = await this.getTrailer({ searchId, searchType });
  let castnCrew = await this.getCastAndCrew({ searchId, searchType });

  if (
    searchId === searchIdTypes.DAY ||
    searchId === searchIdTypes.WEEK ||
    searchId === searchIdTypes.MOVIE ||
    searchId === searchIdTypes.TV
  ) {
    let resultsList = data.results.map((result) =>
      getDetailsResponseObject(result)
    );
    return resultsList;
  } else {
    return { ...getDetailsResponseObject(data), ...castnCrew, trailer };
  }
};

exports.getTrailer = async ({ searchId, searchType }) => {
  let response = await createRequest({
    searchId,
    searchType,
    requestFor: '/videos',
  });

  return response.body.results.filter((result) => result.type === 'Trailer');
};

exports.getCastAndCrew = async ({ searchId, searchType }) => {
  let response = await createRequest({
    searchId,
    searchType,
    requestFor: '/credits',
  });

  let castList = response.body.cast.map((member) => ({
    id: member.id,
    character: member.character,
    name: member.name,
    profile_path: `${IMAGE_PATH_BASE_URL}/${member.profile_path}`,
  }));

  let crewList = response.body.crew
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

  return castAndCrewInfo;
};

const createRequest = async ({
  searchId,
  searchType,
  params,
  requestFor = '',
}) => {
  let argUrl = BASE_MOVIE_API_URL + `/${searchType}`;
  let targetUrl = `${argUrl}/${searchId}${requestFor}?api_key=${API_KEY}${
    params ? params : ''
  }`;
  console.log('Getting data from:' + targetUrl);

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

exports.getSimilarMovies = async ({ searchId, searchType }) => {
  let response = await createRequest({
    searchId,
    searchType,
    requestFor: '/similar',
  });

  return response.results.map((result) => getDetailsResponseObject(result));
};

exports.getDetailsResponseObject = (responeData) => {
  const {
    id,
    original_title,
    release_date,
    first_air_date,
    original_language,
    genres,
    overview,
    number_of_seasons,
    poster_path,
    vote_average,
    runtime,
    created_by,
    media_type,
  } = responeData;

  var responeObject = {
    id,
    original_title,
    original_name,
    release_date,
    first_air_date,
    original_language,
    genres,
    overview,
    number_of_seasons,
    poster_path: IMAGE_PATH_BASE_URL + poster_path,
    vote_average,
    runtime,
    created_by,
    media_type,
  };
  return responeObject;
};
