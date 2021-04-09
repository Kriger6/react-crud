import React, {PureComponent} from 'react'
import {fetchMusicList, sleep} from '../../services/'
import InputField from '../../components/'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Navbar } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'

class MusicPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      musicList: [],
      songToAdd: '',
      artistToAdd: '',
      fieldActivity: true,
      selected: []
    }
  }

  toggleActivity = () => {
    this.setState({fieldActivity: !this.state.fieldActivity})
  }

  async componentDidMount() {
      await sleep(1500)
      const data = fetchMusicList()
      this.setState({musicList: data, loading: false})
  }

  createNewSong = () => {
    const {artistToAdd, songToAdd} = this.state
    this.setState((prevState, props) => {
      let newList = [...prevState.musicList]
      newList.push({title: songToAdd, vocals: artistToAdd, id: newList.length+2})
    return {musicList: newList, artistToAdd: '', songToAdd: ''} 
    })
  }

  selectItem = song  => prevState => {
    if (this.state.selected.includes(song.id)) {
      const songIndex = this.state.selected.indexOf(song.id)
      const newSelected = this.state.selected
      newSelected.splice(songIndex, 1)
      this.setState({
        selected: [...newSelected]
      })
      return
    }
    const selection = [...this.state.selected, song.id]
    this.setState({
      selected: selection,
      songToAdd: song.title,
      artistToAdd: song.vocals
    })
  }

  unselectItem = () => this.setState({selected: []})

  updateSong = () => {
    if (this.state.selected.length > 1) return
    const songIndex = this.state.musicList.map(song => song.id).indexOf(...this.state.selected)
    let newList = [...this.state.musicList]
    newList[songIndex] = {vocals: this.state.artistToAdd, title: this.state.songToAdd, id: this.state.selected}

    this.setState({musicList: newList, selected: []})
  }
  
  deleteSong = () => {
    if (this.state.selected.length === 0) return
    var songIndex = []
    const newList = [...this.state.musicList]
    for (let i = 0; i <this.state.musicList.length; i++) {
      if (this.state.selected.includes(this.state.musicList[i].id)) {
        songIndex.push(i)
      }
    }
    if (songIndex !== -1) {
      for (let i = songIndex.length -1; i >= 0; i--) {
        newList.splice(songIndex[i], 1)
      }
    }  
    this.setState({
      musicList:  newList,
      selected: '',
      songToAdd: '',
      artistToAdd: ''
    })
  }

  handleInputChange = field => event => {
      this.setState({[field]: event.target.value})
  }

  renderMusicList = () => {
    return this.state.musicList.map(song => {
      return (
        <div className="music-list border-primary" onClick={this.selectItem(song)} key={`song_${song.id}`} style={{ marginTop: '20px', cursor: 'pointer', background: this.state.selected.includes(song.id) ? 'linear-gradient(-65deg, lightgreen, lightblue)' : 'lightgrey'}}>
        <p className="mt-2" style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color:'white'}}>{song.title}</p>
        <p style={{textAlign: 'center', fontSize: 13, color: 'green'}}>{song.vocals}</p>  
      </div>)
    })
  }

  render() {
    const {loading, songToAdd, artistToAdd} = this.state
    
    if(loading) {
        return( 
      <div className="d-flex flex-row align-items-center" style={{ background: "#007bff", height: "100vh"}}>
        <Container className="shadow-lg d-flex loading h-25 p-2 bg-light rounded" style={{width: "350px"}}>
          <div className="d-flex flex-column justify-content-center align-items-center w-100">
            <h1 className="mb-4">Loading...</h1>
            <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        </Container>
      </div>
      )
    }

    return (
      <div clasName="" style={{display: 'flex',flexDirection:'column', justifyContent:'center', alignItems: 'center'}}>
        <Container className="p-0" fluid >
          <Navbar className="nav" bg="primary">
            <h1 className="font-weight-light font-size-12" onClick={this.unselectItem}>Hello from Music Page</h1>
          </Navbar>
        </Container>
        <Container className="bg-light pb-5 vh-100" fluid>
          <div style={{flex: 1, marginTop: '20px', flexDirection: 'column'}}>
            <input style={{marginRight: "10px"}} value={songToAdd} placeholder='Song Name' onChange={this.handleInputChange('songToAdd')} />
            <input style={{marginRight: "10px"}} value={artistToAdd} placeholder='Artist Name' onChange={this.handleInputChange('artistToAdd')}/>
            <Button className="mr-2" disabled={songToAdd === "" || artistToAdd === ""} onClick={this.state.selected.length !== 0 ? this.updateSong : this.createNewSong}>{this.state.selected.length !== 0 ? 'Edit' : 'Add new'}  song</Button>
            <Button onClick={this.state.selected ? this.deleteSong : null}>Delete song</Button>

            <InputField toggleActivity={this.toggleActivity} fieldActivity={this.state.fieldActivity}/>
          </div>
          <Container className="list">
            {this.renderMusicList()}
          </Container>
        </Container>
        <Container>
          <footer></footer>
        </Container>
      </div>
    )
  }
}

export default MusicPage