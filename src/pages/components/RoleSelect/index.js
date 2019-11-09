/* eslint-disable */
import React, { Component } from 'react';
import { Select } from 'antd';
// import PropTypes from 'prop-types';
var classNames = require('classnames');
import { queryRoles } from '@/services/role.api';
const Option = Select.Option;

const initRoles = [
    {
        value: '0',
        text: '请选择',
    },
];
// import style from './index.less';
export default class RoleSelect extends Component {
    constructor(props) {
        super(props);

        const roles = [
            ...initRoles,
            // {
            //     value: '3',
            //     text: '加油员',
            // },
            // {
            //     value: '4',
            //     text: '站长',
            // },
            // {
            //     value: '8',
            //     text: '供应商',
            // },
        ];
        this.state = {
            roles,
            value: props.value || props.initValue || '0', // 默认是某个角色
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
    componentDidMount() {
        let that = this;
        queryRoles().then(function(data) {
            const { result, code } = data;
            if (code == 200) {
                let newRoles = result.map(item => {
                    const { nameCH, id } = item;
                    return {
                        text: nameCH,
                        value: id,
                    };
                });
                console.log(result);
                console.log('refresh');
                that.setState({
                    roles: [...initRoles, ...newRoles],
                    value: that.state.value,
                });
            }
        });
    }
    render() {
        const { roles } = this.state;
        const OptionDom = roles.map((item, index) => {
            const { value, text } = item;
            return (
                <Option value={value} key={index}>
                    {text}
                </Option>
            );
        });
        const { disabled } = this.props;
        const roleSelectDom = (
            <Select
                onChange={this.onChange}
                style={{ width: '100%' }}
                value={this.state.value}
                disabled={disabled}
            >
                {OptionDom}
            </Select>
        );
        return roleSelectDom;
    }
}
