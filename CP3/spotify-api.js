(function () {
  "use strict";

  const clientId = "7bc07b0bb69647c687d4d4d42690ccac";
  const clientSecret = "d64225d0b2854d8a9850b51f3598478b";

  function checkStatus(response) {
    if (!response.ok) {
      return Error("Spotify API getting gapped");
    } else {
      return response;
    }
  }

  function handleRequestError(err) {
    console.error("Error: " + err);
  }

  function getToken() {
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => data.access_token);
  }

  async function getFavoriteArtist(access_token) {
    try {
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
    } catch (err) {
      handleRequestError(err);
    }
  }

  async function getFavoriteSong(access_token) {
    try {
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
    } catch (err) {
      handleRequestError(err);
    }
  }

  async function getFavoriteUser(access_token) {
    try {
      let data = await fetch("https://api.spotify.com/v1/users/ahong135", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      });
      checkStatus(data);
      data = await data.json();
      return data;
    } catch (err) {
      handleRequestError(err);
    }
  }

  async function init() {
    const access_token = await getToken();
    let promises = [];
    promises.push(getFavoriteArtist(access_token));
    promises.push(getFavoriteSong(access_token));
    promises.push(getFavoriteUser(access_token));
    try {
      let results = await Promise.all(promises);
      for (let i = 0; i < results.length; i++) {
        let data = results[i];
        console.log(data);
      }
    } catch (err) {
      handleRequestError(err);
    }
  }

  init();
})();

// (function () {
//   "use strict";

//   function requestAuthorization() {
//     var redirect_uri = "http://127.0.0.1:5500/CS132Projects/CP3/index.html";

//     var client_id = "7bc07b0bb69647c687d4d4d42690ccac";
//     var client_secret = "d64225d0b2854d8a9850b51f3598478b";
//     const AUTHORIZE = "https://accounts.spotify.com/authorize";
//     let url = AUTHORIZE;
//     url += "?client_id=" + client_id;
//     url += "&response_type=code";
//     url += "&redirect_uri=" + encodeURI(redirect_uri);
//     url += "&show_dialog=true";
//     url +=
//       "&scope=user-read-playback-state user-read-currently-playing user-follow-read user-read-recently-played user-read-playback-position playlist-read-collaborative playlist-read-private user-read-email user-read-private user-library-read";
//     console.log(url);
//     window.location.href = url;
//   }

//   function init() {
//     id("spotify-oauth").addEventListener("click", requestAuthorization);
//   }

//   init();
// })();

// http://127.0.0.1:5500/CS132Projects/CP3/index.html?code=AQD3ZvWu3A6IMpkpUt1nrVKIIob5uUR4iAjvWxyChdHC8f-areNaEn5mx-Hdn2FDWvVCftZZj3uG2EGp9DuEvCCCX3k-3RqC0BR2eciVoNMJPsgTJhAGMxiZ16Iui_uK2UK-c_Zor2WJymyxN8BfSLtozyC5FUhpFs3cDwacxMtqmYmd1TOIOiCox9T3vyAcDMwWZ1NvbpyFm5ArUdy6wf1EiHlBIRNY7w6UjD2-dzo8fVShglnrPh7HNcBLixWZu8yUpQag145BiSXos8_GH_G8XSVoKyYUTj3TOi4ZA88-pVnZ6qScPzF-yphNKM1kfqkGVn9z56Ld_VVk3yUf5IVsydNvaADIKze85lia1Sn6LtTqDdVOOLGil_GPCsofOVNmJ2TKLmfAbWlIyn3eJxPGRpoCRMB8SK-9jxuwWUqejwpwaG4YSV5o40Z8JzhiRW2Z9HWOD_TSp-DgbENHTGj2gBTo79WaAnKogDBUCjF4Zs6Dc4P0P3VlruCybWARRwc
