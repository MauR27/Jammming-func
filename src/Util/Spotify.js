let accessToken;
const Spotify = {
  getAccessToken() {
    const accessToken = window.location.href.match(/access_token=([^&]*)/);
    return accessToken;
  },

  async search(term) {
    const accessToken = Spotify.getAccessToken();

    const res = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken[1]}`,
        },
      }
    );
    const resJson = await res.json();

    if (!resJson.tracks) {
      return [];
    }
    const data = resJson.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
    return data;
  },

  async savePlayList(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken[1]}` };
    let userId;

    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: headers,
    });

    const resJson = await res.json();

    userId = resJson.id;

    const resUser = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ name: name }),
      }
    );
    const resJsonUser = await resUser.json();
    const playlistId = resJsonUser.id;

    return fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ uris: trackUris }),
      }
    );
  },
};

export default Spotify;
