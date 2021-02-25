import React, {PureComponent} from 'react'
import {fetchMusicList, sleep} from '../../services/'
import InputField from '../../components/'


class MusicPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      musicList: [],
      songToAdd: '',
      artistToAdd: '',
      fieldActivity: true
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

  selectItem = song  => event => {
    this.setState({
      selected: song.id,
      songToAdd: song.title,
      artistToAdd: song.vocals
    })
  }

  unselectItem = () => this.setState({selected: null})

  updateSong = () => {
    const songIndex = this.state.musicList.map(song => song.id).indexOf(this.state.selected)
    let newList = [...this.state.musicList]
    newList[songIndex] = {vocals: this.state.artistToAdd, title: this.state.songToAdd, id: this.state.selected}

    this.setState({musicList: newList, selected: null})
  }
  
  deleteSong = () => {
    const songIndex = this.state.musicList.map(song => song.id).indexOf(this.state.selected)
    const newList = [...this.state.musicList] 
    newList.splice(songIndex, 1)
    this.setState({
      musicList:  newList,
      selected: null,
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
      <div onClick={this.selectItem(song)} key={`song_${song.id}`} style={{marginTop: '20px', cursor: 'pointer', background: this.state.selected === song.id ? 'red' : 'black', borderWidth: 1, border: '1px solid black', flex: 1, alignItems: 'center', justifyContent: 'center', width: '100px'}}>
        <p style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color:'lightblue'}}>{song.title}</p>
        <p style={{textAlign: 'center', fontSize: 13, color: 'green'}}>{song.vocals}</p>
      </div>)
    })
  }

  render() {
    const {loading, songToAdd, artistToAdd} = this.state
    
    if(loading) {
      return <h1>Loading...</h1>
    }

    return (
      <div style={{display: 'flex',flexDirection:'column', justifyContent:'center', alignItems: 'center'}}>
        <h1 onClick={this.unselectItem}>Hello from Music Page</h1>
        {this.renderMusicList()}
        <div style={{flex: 1, marginTop: '20px', flexDirection: 'column'}}>
          <input value={songToAdd} placeholder='Song Name' onChange={this.handleInputChange('songToAdd')} />
          <input value={artistToAdd} placeholder='Artist Name' onChange={this.handleInputChange('artistToAdd')}/>
          <button disabled={songToAdd === "" || artistToAdd === ""} onClick={this.state.selected ? this.updateSong : this.createNewSong}>{this.state.selected ? 'Edit' : 'Add new'}  song</button>
          <button onClick={this.state.selected ? this.deleteSong : null}>Delete song</button>

          <InputField toggleActivity={this.toggleActivity} fieldActivity={this.state.fieldActivity}/>
        </div>
      </div>
    )
  }
}

export default MusicPage