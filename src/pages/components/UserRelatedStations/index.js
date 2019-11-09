/* eslint-disable */
import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import { bindActionCreator } from '@/utils/bindActionCreators';
import { queryList } from './actionCreater';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const PAGE_SIZE = 1000; // 不分页所以设置比较大的值

function unBindStationAction(payload) {
    return {
        type: `refuelworker/unBindStation`,
        payload,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        queryList: bindActionCreator(queryList, dispatch),
        unbindStation: bindActionCreator(unBindStationAction, dispatch),
        // showModal: bindActionCreator(showModal, dispatch),
        // CreateModal: bindActionCreator(CreateModal, dispatch),
        // updateModal: bindActionCreator(updateModal, dispatch),
        // delStation: bindActionCreator(delStation, dispatch),
    };
}
@connect(
    state => {
        return {
            list: state.userrs.dataList,
            totalCount: state.userrs.totalCount,
        };
    },
    mapDispatchToProps
)
class UserRelatedStations extends Component {
    constructor(props) {
        super(props);
        const columns = [
            {
                title: '绑定时间',
                dataIndex: 'modifyTime',
                key: 'modifyTime',
                align: 'center',
                width: 400,
                render: (text, record, index) => {
                    return moment(text).format(dateFormat);
                },
            },
            {
                title: '油站名称',
                dataIndex: 'supplierASName',
                key: 'supplierASName',
                align: 'center',
                width: 400,
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                align: 'center',
                width: 100,
                // eslint-disable-next-line no-unused-vars
                render: (text, record, index) => {
                    let that = this;
                    return (
                        <div>
                            <Button type="primary" onClick={() => that.unbindStation(record)}>
                                解绑
                            </Button>
                        </div>
                    );
                },
            },
        ];
        this.state = {
            columns,
            userid: props.userid || undefined, // 默认是空数组
        };
    }

    componentDidMount() {
        // 获取油站列表
        this.getStationList(1);
    }

    refreshList() {
        // 获取油站列表
        this.getStationList(1);
    }

    getStationList = (page, where) => {
        const { queryList } = this.props;

        // dispatch({
        //     type: 'oilstation/queryList',
        //     payload:{
        //         "pageIndex": page,
        //         "pageSize": PAGE_SIZE,
        //         "where":where || {}
        //     }
        // });
        const { userid } = this.state;
        queryList({
            pageIndex: page,
            pageSize: PAGE_SIZE,
            userid,
            where: where || {},
        });
    };

    componentWillReceiveProps(nextProps) {
        const userid = nextProps.userid || [];
        this.setState({
            userid,
        });
    }

    unbindStation = record => {
        const { supplierASCode, id } = record;
        const { userid } = this.state;
        const { unbindStation } = this.props;
        let that = this;
        unbindStation({
            id,
        }).then(res => {
            const { code } = res;
            if (code === 200) {
                message.success('解绑成功');

                //刷新关联的列表
                that.refreshList();
                //关闭弹窗
                // that.closeModal();
            } else {
                message.error(res.message || '解绑失败');
            }
        });
    };
    render() {
        const { columns } = this.state;
        const { list } = this.props;
        return (
            <div style={{ height: '300px', overflowY: 'auto' }}>
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
export default UserRelatedStations;
