/* eslint-disable */
import React, { Component } from 'react';
import { Checkbox } from 'antd';
// import PropTypes from 'prop-types';
var omit = require('object.omit');
var classNames = require('classnames');
import { queryOperats } from '@/services/role.api';
// import style from './index.less';
export default class OperatsSelect extends Component {
    constructor(props) {
        super(props);
        const allOperats = [
            {
                value: '1',
                label: '权限1',
            },
            {
                value: '2',
                label: '权限2',
            },
            {
                value: '3',
                label: '权限3',
            },
        ];
        this.state = {
            allOperats,
            value: props.value || [], // 默认是空数组
        };
    }

    componentWillReceiveProps(nextProps) {
        const value = nextProps.value || [];
        this.setState({
            value,
        });
    }
    onChange = value => {
        console.log(`checked ${value}`);
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
        // this.setState({
        //     value,
        // })
        // if (this.props.onChange) {
        //     this.props.onChange(value);
        // }
    };
    componentDidMount() {
        let that = this;
        queryOperats().then(function(data) {
            const { result, code } = data;
            if (code == 200) {
                let newAllOperats = that.state.allOperats;
                console.log('refresh');
                that.setState({
                    allOperats: newAllOperats,
                });
            }
        });
    }

    render() {
        const { value, allOperats } = this.state;
        // const OptionDom = allOperats.map((item,index)=>{
        //     const {value,text} = item;
        //     return <Option value={value} key={index}>{text}</Option>
        // })
        // const operatsSelectDom = (
        //     <Select onChange={this.onChange} style={{ width: '100%' }} value={this.state.value}>
        //         {OptionDom}
        //     </Select>

        // );
        return <Checkbox.Group options={allOperats} value={value} onChange={this.onChange} />;
    }
}
