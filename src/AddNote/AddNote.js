import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'

export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  state = {
    submitted: false
  }

  handleSubmit = e => {
    e.preventDefault();
    const newNote = {
      notename: e.target['note-name'].value,
      notecontents: e.target['note-content'].value,
      list_id: e.target['note-folder-id'].value,
      date_added: new Date(),
    }
    this.setState({submitted: true})
    if(newNote.notecontents.length < 10){
      return
    } 
    //console.log(newNote);
    fetch(`${config.API_ENDPOINT}/api/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  validateContent = () => {
    if(document.getElementById('note-content-input').value.length < 10){
      return <p className="error">Content must be more than 10 characters</p>
    }
  }
  validateName =() => {
    if(document.getElementById('note-name-input').value.length < 3){
      return <p className="error">Name must be more than 3 characters</p>
    }
  }

  validateFolder = () => {
    if(document.getElementById('note-folder-select').value === null){
      return <p className="error">Folder must be selected</p>
    }
  }

  render() {
    const { folders=[] } = this.context;
    //console.log(folders)
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' required/>
            {this.state.submitted && this.validateName()}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' required/>
            {this.state.submitted && this.validateContent()}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' required>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.listname}
                </option>
              )}
            </select>
            {this.state.submitted && this.validateFolder()}
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
