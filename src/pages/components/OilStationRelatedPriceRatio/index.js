/* eslint-disable */
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { bindActionCreator } from '@/utils/bindActionCreators';
import { getRewardRatioList } from './actionCreater';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

function mapDispatchToProps(dispatch) {
    return {
        getRewardRatioList: bindActionCreator(getRewardRatioList, dispatch),
    };
}
@connect(
    state => {
        return {
            list: state.oilstation.rewardRatioList,
            totalCount: state.oilstation.rewardRatioTotal,
        };
    },
    mapDispatchToProps
)
class OilStationRelatedPriceRatio extends Component {
    constructor(props) {
        super(props);
        const columns = [
            {
                title: '比例启用时间',
                dataIndex: 'startDT',
                key: 'startDT',
                align: 'center',
                width: 400,
                render: (text, record, index) => {
                    return moment(text).format(dateFormat);
                },
            },
            {
                title: '油站返点比例',
                dataIndex: 'yzRatio',
                key: 'yzRatio',
                align: 'center',
                width: 400,
                render: (text, record, index) => {
                    return `${text}%`;
                },
            },
            {
                title: '司机优惠比例',
                dataIndex: 'sjRatio',
                key: 'sjRatio',
                align: 'center',
                width: 400,
                render: (text, record, index) => {
                    return `${text}%`;
                },
            },
            {
                title: '比例状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                width: 400,
                render: text => (text === 10 ? '已启用' : text === 20 ? '已废弃' : '编辑中'),
            },
        ];
        this.state = {
            columns,
            supplierCode: props.supplierCode || undefined, // 默认是空数组
        };
    }

    componentDidMount() {
        this.getStationList();
    }

    getStationList = () => {
        const { getRewardRatioList } = this.props;
        console.log(this.props);
        console.log('====================');
        const { supplierCode } = this.state;
        getRewardRatioList({
            supplierCode,
        });
    };

    componentWillReceiveProps(nextProps) {
        const supplierCode = nextProps.supplierCode || [];
        this.setState({
            supplierCode,
        });
    }

    render() {
        const { columns } = this.state;
        const { list } = this.props;
        return (
            <div style={{ height: '120px', overflowY: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={list}
                    bordered
                    pagination={false}
                    style={{ backgroundColor: '#f5f5f5' }}
                />
            </div>
        );
    }
}
export default OilStationRelatedPriceRatio;
