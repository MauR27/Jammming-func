import React, { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../Util/Spotify";

let scope = "playlist-modify-public";
let url = "https://accounts.spotify.com/authorize";
url += "?response_type=token";
url += "&client_id=" + encodeURIComponent("3d8873fdcb144c4687bea7bb36643226");
url += "&scope=" + encodeURIComponent(scope);
url += "&redirect_uri=" + encodeURIComponent("http://localhost:3000");
function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const token = Spotify.getAccessToken();
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const addTrack = (track) => {
    if (playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }

    setPlaylistTracks((prev) => [...prev, track]);
  };

  const removeTrack = (track) => {
    let newTracks = playlistTracks.filter(
      (remTrack) => remTrack.id !== track.id
    );
    return setPlaylistTracks(newTracks);
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map((track) => track.uri);
    Spotify.savePlayList(playlistName, trackURIs);
    setPlaylistName("New Playlist");
    setPlaylistTracks([]);
  };
  console.log(playlistName);

  const search = async (term) => {
    const _searchResults = await Spotify.search(term);

    setSearchResults(_searchResults);
    console.log(_searchResults);
  };

  const handleLog = () => {
    console.log(Spotify.getAccessToken());
  };
  return (
    <div>
      {accessToken ? (
        <>
          <h1>
            Ja<span className="highlight">mmm</span>ing
          </h1>
          <div className="App">
            {<SearchBar onSearch={search} />}
            <div className="App-playlist">
              {<SearchResults searchResults={searchResults} onAdd={addTrack} />}
              {
                <Playlist
                  playlistName={playlistName}
                  playlistTracks={playlistTracks}
                  onRemove={removeTrack}
                  onNameChange={updatePlaylistName}
                  onSave={savePlaylist}
                />
              }
            </div>
          </div>
        </>
      ) : (
        <>
          <button onClick={handleLog}>log token</button>
          <a href={url}>LOGIN</a>
        </>
      )}
    </div>
  );
}

export default App;
