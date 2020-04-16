import React from 'react';
import './App.css';
import {JsonEditor as Editor} from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import axios from 'axios';
import config from 'config';

const serverUrl = config.get('server.url');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            showEditor: false,
            fileAfterEdit: null
        }
    }

    handleChange = (fileAfterEdit) => {
        this.setState({fileAfterEdit})
    }
    handleFileUpload = (event) => {
        const file = event.target.files[0];

        this.setState({file})

    }
    renderFileLoader = () => {
        return (
            <div>
                <input type="file" name="file" onChange={this.handleFileUpload}/>
                <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload
                </button>
            </div>
        )
    }
    onClickHandler = async () => {
        const data = new FormData()
        data.append('file', this.state.file);
        await axios.post(`${serverUrl}upload`, data).then(async res => {

            const url = `${serverUrl}getFile/${res.data.filename}`;
            const result = await axios.get(url);
            const data = result.data;
            let jsonStr = JSON.stringify(data);
            const file = JSON.parse(jsonStr);
            this.setState({file,filename:res.data.filename, showEditor: true})
        })
    }
    saveJson =async () => {
        const {filename:fileName,fileAfterEdit:content} = this.state;
        await axios.post(`${serverUrl}saveFile`, {content,fileName}).then(async res => {

        })
    }

    renderEditor = () => {
        const {file} = this.state;
        return (
            <div className="App">
                <Editor
                    value={file}
                    onChange={this.handleChange}
                />
                <div onClick={this.saveJson} className="btn btn-success btn-block">Save</div>
            </div>)
    }

    render() {
        const {showEditor} = this.state;
        if (showEditor) {
            return this.renderEditor();
        } else {
            return this.renderFileLoader()
        }
    }
}

export default App;
