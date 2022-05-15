(function () {
  "use strict";

  const clientId = "7bc07b0bb69647c687d4d4d42690ccac";
  const clientSecret = "d64225d0b2854d8a9850b51f3598478b";

  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Spotify API Error. Try again later.");
    } else {
      return response;
    }
  }

  function handleRequestError(err) {
    let msg = gen("p");
    msg.textContent = err;
    id("spotify-info").appendChild(msg);
  }

  async function getToken() {
    let data = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });
    checkStatus(data);
    data = await data.json();
    return data.access_token;
  }

  async function getFavoriteArtist(access_token) {
    let data = await fetch(
      "https://api.spotify.com/v1/artists/4WC54JUV6ewZOuz8Cl2Cym",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      }
    );
    checkStatus(data);
    data = await data.json();
    return data;
  }

  async function getFavoriteSong(access_token) {
    let data = await fetch(
      "https://api.spotify.com/v1/tracks/4DuUwzP4ALMqpquHU0ltAB",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      }
    );
    checkStatus(data);
    data = await data.json();
    return data;
  }

  async function getFavoriteUser(access_token) {
    let data = await fetch("https://api.spotify.com/v1/users/ahong135", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    });
    checkStatus(data);
    data = await data.json();
    return data;
  }

  function updateSpotifyElement(id, data) {
    let img = gen("img");
    let caption = gen("figcaption");
    let figure = qs(`#spotify-info #${id}`);
    figure.appendChild(img);
    figure.appendChild(caption);
    if (id === "artist") {
      updateArtist(img, caption, data);
    } else if (id === "song") {
      updateSong(img, caption, data);
    } else {
      updateUser(img, caption, data);
    }
  }

  function updateArtist(img, caption, data) {
    img.src = data.images[0].url;
    img.alt = data.name + " Image";
    caption.textContent = "Artist: " + data.name;
  }

  function updateSong(img, caption, data) {
    img.src = data.album.images[0].url;
    img.alt = data.name + " Image";
    caption.textContent = "Song: " + data.name;
  }
  function updateUser(img, caption, data) {
    img.src = data.images[0].url;
    img.alt = data.display_name + " Image";
    caption.textContent = "User: " + data.display_name;
  }

  async function init() {
    let ids = ["artist", "song", "user"];
    let promises = [];

    try {
      const access_token = await getToken();
      promises.push(getFavoriteArtist(access_token));
      promises.push(getFavoriteSong(access_token));
      promises.push(getFavoriteUser(access_token));
      let results = await Promise.all(promises);
      for (let i = 0; i < results.length; i++) {
        let data = results[i];
        updateSpotifyElement(ids[i], data);
      }
    } catch (err) {
      handleRequestError(err);
    }
  }

  window.addEventListener("load", init);
})();
