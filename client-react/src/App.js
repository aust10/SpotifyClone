import React, { useEffect } from 'react'
import './App.css'
import codes from './secrets'
import Login from './Login'
import Player from './Player'
import { getTokenFromUrl } from './spotify'
import { useDataLayerValue } from './DataLayer'
import SpotifyWebApi from 'spotify-web-api-js'

const spotify = new SpotifyWebApi()

function App () {
  const [{ user, token }, dispatch] = useDataLayerValue()

  useEffect(() => {
    const hash = getTokenFromUrl()
    // make it so that the token is not in the url but stored in data
    window.location.hash = ''
    const _token = hash.access_token

    if (_token) {
      dispatch({
        type: 'SET_TOKEN',
        token: _token
      })

      dispatch({
        type: 'SET_SPOTIFY',
        spotify: spotify
      })
      // this gives spotify access to the token
      spotify.setAccessToken(_token)

      // gets the users account
      spotify.getMe().then((user) => {
        // dispatch will push it to the datalayer
        dispatch({
          type: 'SET_USER',
          user: user
        })
      })

      spotify.getMyTopArtists().then((response) => {
        dispatch({
          type: 'SET_TOP_ARTISTS',
          top_artists: response
        })
      })

      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: 'SET_PLAYLISTS',
          playlists: playlists
        })
      })

      spotify.getPlaylist(`${codes.contextID}`).then(response => {
        dispatch({
          type: 'SET_DISCOVER_WEEKLY',
          discover_weekly: response
        })
      })
    }
  }, [token, dispatch])
  console.log(user, 'hi')
  return (
    <div className='app'>
      {
        token
          ? <Player spotify={spotify} />
          : <Login />
      }
    </div>
  )
}

export default App
