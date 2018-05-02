import React from 'react';

import Input from "./Input";
import {transform} from './transform';
import {promiseReverse} from "./reverse";

let initialStarterText = "";

type AppProps = {};
type AppState = {
    inputText: string,
    outputText: string,
    error?: string,
    reverseError?: string,
    shouldFormat: boolean
};

export default class App extends React.Component<AppProps, AppState> {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.inputTextUpdate = this.inputTextUpdate.bind(this);
        this.outputTextUpdate = this.outputTextUpdate.bind(this);

        this.state = {
            inputText: initialStarterText,
            outputText: "",
            shouldFormat: false
        }
    }

    componentDidMount() {
        // TODO: remove me...
        this.update();
    }

    inputTextUpdate(e) {
        this.setState({
            inputText: e.target.value
        }, () => {
            this.update();
        });
    }

    outputTextUpdate(e) {
        this.setState({
            outputText: e.target.value
        }, () => {
            let outputText = this.state.outputText;
            if (outputText === initialStarterText) {
                this.setState({
                    outputText: initialStarterText,
                    reverseError: null
                });
                return;
            }
            return promiseReverse(outputText)
                .then(result => {
                    this.setState({
                        inputText: result.css,
                        reverseError: null
                    })
                })
                .catch(error => {
                    this.setState({
                        reverseError: error
                    })
                });
        });
    }

    update(shouldFormat = this.state.shouldFormat) {

        console.log('update', arguments);

        if (this.state.inputText === initialStarterText) {
            this.setState({
                inputText: initialStarterText,
                error: null
            });
            return;
        }

        try {
            let transformed = transform(this.state.inputText);

            let result = JSON.stringify(transformed, null, shouldFormat ? 2 : 0);
            this.setState({
                outputText: result,
                error: null,
                shouldFormat
            });
        } catch (ex) {
            this.setState({
                error: ex
            });
        }
    }

    render() {
        let outputCssStyle = this.state.error ? {
            "backgroundColor": "lightcoral"
        } : null;
        console.log('state', this.state);
        let inputText = this.state.reverseError || this.state.inputText;
        let outputText = this.state.error || this.state.outputText;

        return (
            <div style={{"textAlign": "center"}}>
                <Input
                    ref='inputCss' placeholder="Type or paste CSS here..." onChange={this.inputTextUpdate}
                    value={inputText}
                />
                <textarea
                    ref='outputCss' placeholder="Type or paste React in-line style object here..."
                    onChange={this.outputTextUpdate}
                    value={outputText}
                    cols={40} rows={20} style={outputCssStyle}
                />
                <br/>
                <input style={{"marginLeft": "266px"}} ref="useNewline" checked={this.state.shouldFormat}
                       type="checkbox" onChange={e => this.update(e.target.checked)}/> Format
            </div>
        );
    }
}