/* eslint-disable */
import React, { Component, cloneElement } from 'react';
var classNames = require('classnames');
var omit = require('object.omit');
// import './index.scss';
export default class Icon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = omit(this.props, ['type']);
        let dom;
        let iconClass = 'icon iconfont icon-' + this.props.type;
        classNames('icon', 'icon', `icon-${this.props.type}`);
        dom = <i className={iconClass} {...props} />;
        return dom;
    }
}
