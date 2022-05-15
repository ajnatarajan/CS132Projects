/*
  Name: Ajay Natarajan
  CS 132 Spring 2022
  Date: May 15th, 2022
  This is the spotify-api.js file for my personal website. It is used
  by index.html to handle displaying some of my favorite Spotify-related
  items. It uses the Spotify API.
 */

(function () {
  "use strict";

  const CLIENT_ID = "7bc07b0bb69647c687d4d4d42690ccac";
  const CLIENT_SECRET = "d64225d0b2854d8a9850b51f3598478b";

  /**
   * Throw an error if response object is not ok.
   * @param {Response} response - the response object in question
   * @returns {Response} response - if response object is ok, returns it
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Spotify API Error. Try again later.");
    } else {
      return response;
    }
  }

  /**
   * Notify the user that the request to the Spotify API has failed.
   * @param {Error} err - the error object
   * @returns {void}
   */
  function handleRequestError(err) {
    let msg = gen("p");
    msg.textContent = err;
    id("spotify-info").appendChild(msg);
  }

  /**
   * Get access token in order to make calls to Spotify API.
   * No parameters.
   * @returns {string} access token
   */
  async function getToken() {
    let data = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
      },
      body: "grant_type=client_credentials",
    });
    checkStatus(data);
    data = await data.json();
    return data.access_token;
  }

  /**
   * Get the relevant data for Joel Sunny (my favorite artist)
   * @param {string} access_token - access token required for Spotify API calls
   * @returns {JSON} relevant data for my favorite artist
   */
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

  /**
   * Get the relevant data for Tyler Herro (my favorite song)
   * @param {string} access_token - access token required for Spotify API calls
   * @returns {JSON} relevant data for my favorite song
   */
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

  /**
   * Get the relevant data for Audrey (my favorite user AKA my girlfriend)
   * @param {string} access_token - access token required for Spotify API calls
   * @returns {JSON} relevant data for Audrey
   */
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

  /**
   * Handle updating the DOM with the data from the Spotify API
   * @param {string} id - artist, song, or user
   * @param {*} data - data from Spotify API
   * @returns {void}
   */
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

  /**
   * Update the DOM with the proper information for the artist.
   * @param {Element} img - image element
   * @param {Element} caption - figure caption element
   * @param {JSON} data - data from Spotify API
   * @returns {void}
   */
  function updateArtist(img, caption, data) {
    img.src = data.images[0].url;
    img.alt = data.name + " Image";
    caption.textContent = "Artist: " + data.name;
    img.addEventListener("click", () => {
      window.open(`${data.external_urls.spotify}`, "_blank");
    });
  }

  /**
   * Update the DOM with the proper information for the song.
   * @param {Element} img - image element
   * @param {Element} caption - figure caption element
   * @param {JSON} data - data from Spotify API
   * @returns {void}
   */
  function updateSong(img, caption, data) {
    img.src = data.album.images[0].url;
    img.alt = data.name + " Image";
    caption.textContent = "Song: " + data.name;
    img.addEventListener("click", () => {
      window.open(`${data.album.external_urls.spotify}`, "_blank");
    });
  }

  /**
   * Update the DOM with the proper information for the song.
   * @param {Element} img - image element
   * @param {Element} caption - figure caption element
   * @param {JSON} data - data from Spotify API
   * @returns {void}
   */
  function updateUser(img, caption, data) {
    img.src = data.images[0].url;
    img.alt = data.display_name + " Image";
    caption.textContent = "User: " + data.display_name;
    img.addEventListener("click", () => {
      window.open(`${data.external_urls.spotify}`, "_blank");
    });
  }

  /**
   * Initialize access token, make all necessary API calls, update DOM
   */
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

  /* Spec explicitly requires listening for an event so I'm doing this on load
   * even though this script is already a defer script.
   */
  window.addEventListener("load", init);
})();
