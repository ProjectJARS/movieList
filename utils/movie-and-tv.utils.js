const got = require('got');

const { BASE_MOVIE_API_URL, API_KEY } = require('../config');
const { searchIdTypes } = require('../utils/search.types');
const { IMAGE_PATH_BASE_URL } = require('../utils/urls');

exports.getDetails = async ({ searchId, searchType, params = '' }) => {
  try {
    let response = await this.createRequest({ searchId, searchType, params });
    let data = JSON.parse(response.body);

    if (
      searchId === searchIdTypes.DAY ||
      searchId === searchIdTypes.WEEK ||
      searchId === searchIdTypes.MOVIE ||
      searchId === searchIdTypes.TV
    ) {
      let resultsList = data.results.map((result) =>
        this.getDetailsResponseObject(result)
      );
      return resultsList;
    } else {
      let trailer = await this.getTrailer({ searchId, searchType });
      let castnCrew = await this.getCastAndCrew({ searchId, searchType });
      return { ...this.getDetailsResponseObject(data), ...castnCrew, trailer };
    }
  } catch (error) {
    throw error;
  }
};

exports.getTrailer = async ({ searchId, searchType }) => {
  try {
    const response = await this.createRequest({
      searchId,
      searchType,
      requestFor: '/videos',
    });

    const jsonResponse = JSON.parse(response.body);

    return jsonResponse.results.filter((result) => result.type === 'Trailer');
  } catch (error) {
    throw new Error(error);
  }
};

exports.getCastAndCrew = async ({ searchId, searchType }) => {
  const response = await this.createRequest({
    searchId,
    searchType,
    requestFor: '/credits',
  });

  const jsonResponse = JSON.parse(response.body);

  let castList = jsonResponse.cast.map((member) => ({
    id: member.id,
    character: member.character,
    name: member.name,
    profile_path: `${IMAGE_PATH_BASE_URL}/${member.profile_path}`,
  }));

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

  return castAndCrewInfo;
};

exports.createRequest = async ({
  searchId,
  searchType,
  params,
  requestFor = '',
}) => {
  if (!searchId) throw new Error('Search Id not provided');
  if (!searchType) throw new Error('Search type not provided');

  console.log(process.env.MOVIE_DB_API_URL);

  let targetUrl =
    BASE_MOVIE_API_URL +
    `/${searchType}/${searchId}${requestFor}?api_key=${API_KEY}${
      params ? `&${params}` : ''
    }`;
  console.log('Getting data from: ' + targetUrl);

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

exports.getDetailsResponseObject = (responseData) => ({
  ...responseData,
  poster_path: IMAGE_PATH_BASE_URL + responseData.poster_path,
  created_by: responseData.created_by ? responseData.created_by : [],
});
