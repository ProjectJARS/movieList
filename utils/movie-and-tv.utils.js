const got = require('got');

const { BASE_MOVIE_API_URL, API_KEY } = require('../utils/api');
const { searchIdTypes } = require('../utils/search.types');
const { IMAGE_PATH_BASE_URL } = require('../utils/urls');

exports.getDetails = async ({ searchId, searchType, params = '' }) => {
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
};

exports.getTrailer = async ({ searchId, searchType }) => {
  let response = await this.createRequest({
    searchId,
    searchType,
    requestFor: '/videos',
  });

  return response.body.results.filter((result) => result.type === 'Trailer');
};

exports.getCastAndCrew = async ({ searchId, searchType }) => {
  let response = await this.createRequest({
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

exports.createRequest = async ({
  searchId,
  searchType,
  params,
  requestFor = '',
}) => {
  let targetUrl =
    BASE_MOVIE_API_URL +
    `/${searchType}/${searchId}${requestFor}?api_key=${API_KEY}&${
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

exports.getDetailsResponseObject = (responseData) => ({
  ...responseData,
  poster_path: IMAGE_PATH_BASE_URL + poster_path,
  created_by: [responseData.created_by],
});
