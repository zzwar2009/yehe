/* eslint-disable */
import React, { Component } from 'react';
import { Select } from 'antd';
// import PropTypes from 'prop-types';
var omit = require('object.omit');
var classNames = require('classnames');
const Option = Select.Option;
// import style from './index.less';
export default class StatusSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || props.initValue || '3', // 默认是某个角色
        };
    }

    onChange = value => {
        console.log(`selected ${value}`);
        this.setState({
            value,
        });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };
    componentWillReceiveProps(nextProps) {
        const value = nextProps.value || [];
        this.setState({
            value,
        });
    }

    render() {
        const { value } = this.state;
        return (
            <Select defaultValue={value} style={{ width: '100%' }} onChange={this.onChange}>
                <Option value="0">请选择</Option>
                <Option value="3">启用</Option>
                <Option value="6">暂停</Option>
                <Option value="8">废弃</Option>
            </Select>
        );
    }
}
