import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }

  state = {
    submitted: false
  }
  static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault()
    this.setState({submitted: true})
    const folder = {
      listname: e.target['folder-name'].value
    }
    if(folder.listname.length < 3){
      return
    }
    fetch(`${config.API_ENDPOINT}/api/lists`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  validateName = () => {
    if(document.getElementById('folder-name-input').value.length < 3){
      return <p className="error">Name must be more than 3 characters</p>
    }
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folder-name' />
            {this.state.submitted && this.validateName()}
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
