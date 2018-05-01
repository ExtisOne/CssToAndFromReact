import React from 'react';
import ReactDOM from 'react-dom';

type InputProps = {
    value: string,
    placeholder: string,
    onChange: (event) => void
};
type InputState = {};

export default class Input extends React.Component<InputProps, InputState> {
    componentDidUpdate(prevProps) {
        let node = ReactDOM.findDOMNode(this) as HTMLInputElement; // reference: https://github.com/Microsoft/TypeScript/issues/10453#issuecomment-301263769
        let oldLength = node.value.length;
        let oldIdx = node.selectionStart;
        node.value = this.props.value;
        let newIdx = Math.max(0, node.value.length - oldLength + oldIdx);
        node.selectionStart = node.selectionEnd = newIdx;
    }

    render() {
        return <textarea cols={40} rows={20} {...this.props} value={undefined}/>;
    }
}