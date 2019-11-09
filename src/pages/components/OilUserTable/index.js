/* eslint-disable */
import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import { bindActionCreator } from '@/utils/bindActionCreators';
import { queryOilUserList } from './actionCreater';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const PAGE_SIZE = 1000; // 不分页所以设置比较大的值

function mapDispatchToProps(dispatch) {
    return {
        queryOilUserList: bindActionCreator(queryOilUserList, dispatch),
    };
}
@connect(
    state => {
        return {
            list: state.oilstation.oilUserList,
            totalCount: state.oilstation.oilUserTotal,
        };
    },
    mapDispatchToProps
)
class OilUserTable extends Component {
    constructor(props) {
        super(props);
        const columns = [
            {
                title: '序号',
                dataIndex: 'userid',
                key: 'userid',
                align: 'center',
                width: 50,
            },
            {
                title: '姓名',
                dataIndex: 'nicknamenative',
                key: 'nicknamenative',
                align: 'center',
                width: 100,
            },
            {
                title: '手机',
                dataIndex: 'mobile',
                key: 'mobile',
                align: 'center',
                width: 100,
            },
            // {
            //     title: '类型',
            //     dataIndex: 'RoleDescription',
            //     key: 'RoleDescription',
            //     align: 'center',
            //     width: 100,
            //     render: text => (text !== undefined ? text : '暂无'),
            // },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                width: 80,
                render: (text, record, index) => {
                    return text === 3 ? '开启' : text === 6 ? '暂停' : text === 8 ? '废弃' : '未知';
                },
            },
            {
                title: '绑定时间',
                dataIndex: 'EnterTime',
                key: 'EnterTime',
                align: 'center',
                width: 200,
                render: (text, record, index) => {
                    return moment(text).format(dateFormat);
                },
            },
        ];
        this.state = {
            columns,
            supplierASCode: props.supplierASCode || undefined, // 默认是空数组
        };
    }

    componentDidMount() {
        const { supplierASCode } = this.state;
        // 获取油站加油员列表
        this.queryOilUserList(1, { userobjno: supplierASCode });
    }

    refreshList() {
        // 获取油站加油员列
        this.queryOilUserList(1);
    }

    queryOilUserList = (page, queryDict) => {
        const { queryOilUserList } = this.props;
        queryOilUserList({
            pageIndex: page,
            pageSize: PAGE_SIZE,
            // supplierASCode,
            queryDict: queryDict || {},
        });
    };

    componentWillReceiveProps(nextProps) {
        const supplierASCode = nextProps.supplierASCode || '';
        console.log('supplierASCode', supplierASCode);
        this.setState({
            supplierASCode,
        });
    }

    render() {
        const { columns } = this.state;
        const { list } = this.props;
        return (
            <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    bordered
                    pagination={false}
                    rowKey={record => record.id}
                />
            </div>
        );
    }
}
export default OilUserTable;
