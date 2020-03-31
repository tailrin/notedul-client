import React from 'react'
import Note from '../Note/Note'
import ApiContext from '../ApiContext'
import { findNote, countNotesForFolder } from '../notes-helpers'
import './NotePageMain.css'

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = ApiContext

  handleDeleteNote = noteId => {
    this.props.history.push(`/`)
  }

  render() {
    const { notes } = this.context;
    console.log(this.context)
    const { note_id } = this.props.match.params;
    const note = findNote(notes, note_id) || {content: ''};
   
    return (
      <section className='NotePageMain'>
        <Note
          id={note.id}
          name={note.notename}
          modified={note.date_created}
          onDeleteNote={this.handleDeleteNote}
        />
        <div className='NotePageMain__content'>
          {note.notecontents.split(/\n \r|\n/).map((para, i) =>
            <p key={i}>{para}</p>
          )}
        </div>
      </section>
    )
  }
}
