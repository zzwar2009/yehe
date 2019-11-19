/* eslint-disable */
import React, { Component } from 'react';
import {
    Icon,
    Button,
    Input,
    Table,
    Card,
    Modal,
    DatePicker,
    Row,
    Col,
    Menu,
    Dropdown,
    message,
} from 'antd';
import { connect } from 'dva';
import styles from './refuelworker.css';
import { bindActionCreator } from '@/utils/bindActionCreators';
import {
    queryList,
    CreateModal,
    showModal,
    updateModal,
    delEntity,
    initPwdModal,
    modifyRelatedStationModal,
} from './actionCreater';
import CreateEntityModal from './CreateModal';
import ChangePwdModal from './ChangePwdModal';
import RelatedStationModal from './RelatedStationModal';
import { PAGE_SIZE } from './const';
import StatusSelect from '@/pages/components/StatusSelect';
import RoleSelect from '@/pages/components/RoleSelect';
const { Search } = Input;
const { confirm } = Modal;
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

function mapDispatchToProps(dispatch) {
    return {
        queryList: bindActionCreator(queryList, dispatch),
        showModal: bindActionCreator(showModal, dispatch),
        CreateModal: bindActionCreator(CreateModal, dispatch),
        updateModal: bindActionCreator(updateModal, dispatch),
        delEntity: bindActionCreator(delEntity, dispatch),
        initPwdModal: bindActionCreator(initPwdModal, dispatch),
        modifyRelatedStationModal: bindActionCreator(modifyRelatedStationModal, dispatch),
    };
}
@connect(
    state => {
        return {
            dataList: state.loginlog.dataList,
            pageIndex: state.loginlog.pageIndex,
            totalCount: state.loginlog.totalCount,
            // addOilModalVisible: state.oilstation.addOilModalVisible,
        };
    },
    mapDispatchToProps
)
class OilPerson extends Component {
    constructor(props) {
        super(props);

        const columns = [
            // {
            //     title: '序号',
            //     dataIndex: 'Order',
            //     key: 'Order',
            //     align: 'center',
            //     width: 50,
            // },
            {
                title: '登陆时间',
                dataIndex: 'created',
                key: 'created',
                align: 'center',
                width: 100,
            },
            {
                title: 'IP地址',
                dataIndex: 'ip',
                key: 'ip',
                align: 'center',
                width: 100,
            },
        ];
        this.state = {
            columns,
            searchText: '',
            status: '0', // 通过用户状态筛选
            role: '0', // 通过用户角色筛选
        };
    }
    statusOnChange = value => {
        // 状态筛选
        this.setState({
            status: value,
        });

        let queryData = {};
        if (value == 0) {
            queryData = {};
        } else {
            queryData = {
                queryDict: {
                    status: value,
                },
            };
        }
        // 搜索
        this.getList(1, queryData);
    };

    roleOnChange = value => {
        // 角色筛选
        this.setState({
            role: value,
        });

        let queryData = {};
        if (value == 0) {
            queryData = {};
        } else {
            queryData = {
                roleDict: {
                    Role_ID: value,
                },
            };
        }
        // 搜索
        this.getList(1, queryData);
    };

    // 弹出筛选用户状态弹框
    dropDownStatus = () => ({
        filterDropdown: () => {
            const { status } = this.state;
            return (
                <div style={{ padding: 8, width: 100 }}>
                    <StatusSelect value={status} onChange={this.statusOnChange} />
                </div>
            );
        },
        filterIcon: <Icon type="down" />,
    });

    dropDownRole = () => ({
        filterDropdown: () => {
            const { role } = this.state;
            return (
                <div style={{ padding: 8, width: 100 }}>
                    <RoleSelect value={status} onChange={this.roleOnChange} />
                </div>
            );
        },
        filterIcon: <Icon type="down" />,
    });

    onPageChange = page => {
        let { searchText } = this.state;
        searchText = searchText || '';

        let queryData = {};
        if (searchText == '') {
            queryData = {};
        } else {
            queryData = {
                queryDict: {
                    LoginName: `like[${searchText}]`,
                    // 'nicknamenative':`like[${searchText}]`,
                    // mobile:`like[${searchText}]`,
                },
            };
        }
        this.getList(page, queryData);
    };

    search = e => {
        //  模糊搜索列表
        const value = e.target.value || '';
        this.setState({ searchText: value });
        let searchText = value;
        let queryData = {};
        if (searchText == '') {
            queryData = {};
        } else {
            queryData = {
                // queryDict: {
                //     LoginName: `like[${searchText}]`,
                //     // 'nicknamenative':`like[${searchText}]`,
                //     // mobile:`like[${searchText}]`,
                // },
                queryDict: {
                    'multi(LoginName,nicknamenative)': `like[${searchText}]`,
                },
            };
        }

        this.getList(1, queryData);
    };

    refreshList = () => {
        // 刷新列表
        const { queryList } = this.props;
        queryList({
            pageIndex: 1,
            pageSize: PAGE_SIZE,
            // where: {},
        });
    };

    DeleteEntity = record => {
        let that = this;
        confirm({
            title: '删除用户',
            content: `确定删除用户${record.nicknamenative} ？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                // 删除油站
                const { delEntity } = that.props;
                delEntity(record.userid).then(res => {
                    const { code } = res;
                    if (code === 200) {
                        message.success('删除成功');
                        // 刷新列表
                        that.refreshList();
                    } else {
                        message.error(res.message || '删除失败');
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    componentDidMount() {
        // 获取列表
        this.getList(1);
    }
    onCreate = () => {};
    getList = (page, params) => {
        const { queryList } = this.props;
        queryList({
            current: page,
            size: PAGE_SIZE,
            ...params,
        });
    };

    showAddModal = () => {
        const { CreateModal } = this.props;
        CreateModal();
    };

    showChangePWdModal = item => {
        // 修改密码
        const { mobile } = item;
        const { initPwdModal } = this.props;
        initPwdModal(mobile);
    };
    showChangeEntityModal = record => {
        const { updateModal } = this.props;
        updateModal(record);
    };

    showBindStationModal = item => {
        // 绑定油站弹窗
        const { modifyRelatedStationModal } = this.props;
        // todo
        modifyRelatedStationModal(item);
    };

    render() {
        const { dataSource, columns, searchText } = this.state;
        const { dataList, totalCount, pageIndex } = this.props;
        const datas = dataList.map((item, index) => {
            return {
                key: index + 1,
                Order: index + 1 + (pageIndex - 1) * PAGE_SIZE, // 序号
                ...item,
            };
        });
        // const searchAction = (
        //     <div>
        //         <Search
        //             placeholder="请输入手机号或用户名查询..."
        //             enterButton="查询"
        //             value={searchText}
        //             allowClear
        //             onChange={this.search}
        //             style={{ width: '20vw', marginRight: 5 }}
        //         />
        //     </div>
        // );
        const addAction = (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span style={{ fontSize: 20, fontWeight: 'bold', display: 'flex' }}>用户列表</span>
            </div>
        );
        return (
            <div>
                <Card title={addAction}>
                    <Table
                        dataSource={datas}
                        columns={columns}
                        // scroll={{ x: 1500 }}
                        pagination={{
                            current: pageIndex,
                            pageSize: PAGE_SIZE,
                            total: totalCount,
                            onChange: this.onPageChange,
                        }}
                    />
                </Card>
            </div>
        );
    }
}
export default OilPerson;
