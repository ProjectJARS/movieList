exports.search = (req, res) => {
  if (!req.query.searchId) {
    res
      .status(200)
      .send(
        '<form action ="/search" method = "get">Movie ID:<input type="text" name="searchId"/><br>Type:<input type="text" name="type"><input type="submit" value="GO"></form>'
      );
  } else {
    if (req.query.type.toLocaleLowerCase() === 'movie')
      res.redirect('/movie/' + req.query.searchId);  //->routes/getInfo.js
    else if (req.query.type.toLocaleLowerCase() === 'tv') {
      res.redirect('/tv/' + req.query.searchId); //->routes/getInfo.js
    } else {
      res.status(400).send('Bad Request');
    }
  }
};
