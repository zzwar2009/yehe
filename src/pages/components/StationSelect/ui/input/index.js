/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
var omit = require('object.omit');
var classNames = require('classnames');
import style from './index.less';
export default class Input extends Component {
    constructor(props) {
        super(props);
        let value;
        if ('value' in props) {
            value = props.value;
            if (value == undefined) {
                value = '';
            }
        } else if ('defaultValue' in props) {
            value = props.defaultValue;
        } else if (value == undefined) {
            value = '';
        }
        this.state = {
            value,
        };
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
        let value;
        if ('value' in nextProps) {
            value = nextProps.value;
        } else if ('defaultValue' in nextProps) {
            value = nextProps.defaultValue;
        } else if (value == undefined) {
            value = '';
        }

        if (value == undefined) {
            value = '';
        }
        this.setState({
            value: value,
        });
    }
    handleKeyUp(e) {
        const { onPressEnter, onKeyDown } = this.props;
        if (e.keyCode == 13 && onPressEnter) {
            onPressEnter(e);
        }
        if (onKeyDown) {
            onKeyDown(e);
        }
    }
    onClick(e) {
        const { onClick } = this.props;
        if (onClick) {
            onClick(e);
        }
    }
    onChange(e) {
        this.setState({
            value: e.target.value,
        });

        const { onPressEnter, onKeyDown, onKeyUp, onChange, readonly } = this.props;
        if (!readonly) {
            //非只读状态改变值和监听键盘事件
            this.setState({
                value: e.target.value,
            });
            if (e.keyCode === 13 && onPressEnter) {
                onPressEnter(e);
            }
            if (onKeyDown) {
                onKeyDown(e);
            }
            if (onKeyUp) {
                onKeyUp(e);
            }
        }
        if (onChange) {
            onChange(e);
        }
    }
    onBlur(e) {
        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    }
    getValue() {
        return this.state.value;
    }
    render() {
        let that = this;
        let dom;
        let input;
        let props = omit(this.props, [
            'onBlur',
            'prefix',
            'error',
            'suffix',
            'onPressEnter',
            'defaultValue',
            'onChange',
            'onClick',
            'reverse',
            'width',
        ]);
        props.value = this.state.value;

        if (!this.props.type) {
            props.type = 'text';
        }
        if (!props.maxLength) {
            props.maxLength = '100'; //默认只能最长输入100个字
        }
        input = (
            <input
                {...props}
                onBlur={this.onBlur.bind(this)}
                onKeyUp={this.handleKeyUp.bind(this)}
                onClick={this.onClick.bind(this)}
                onChange={this.onChange.bind(this)}
            />
        );
        if (this.props.prefix) {
            dom = (
                <div className="form-group input-icon input-icon-before">
                    <span className="input-icon-wrap">{this.props.prefix}</span>
                    {input}
                </div>
            );
        } else if (this.props.suffix) {
            if (this.props.type) {
                dom = (
                    <div className="form-group input-icon input-icon-after input-prompt input-small">
                        <span className="input-icon-wrap">{this.props.suffix}</span>
                        {input}
                    </div>
                );
            } else {
                let clsnames = classNames('input-icon-wrap', { reverse: this.props.reverse });
                dom = (
                    <div className="form-group input-icon input-icon-after">
                        <span className={clsnames}>{this.props.suffix}</span>
                        {input}
                    </div>
                );
            }
        } else {
            if (this.props.error) {
                dom = (
                    <div className="form-group error">
                        {input}
                        <span>{this.props.error}</span>
                    </div>
                );
            } else {
                dom = (
                    <div className="form-group" style={{ width: this.props.width }}>
                        {input}
                    </div>
                );
            }
        }
        return <div className={style.root}>{dom}</div>;
    }
}
