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
    List, Avatar,
} from 'antd';
import { parseImgListStr } from '@/utils/utils';
// const listData = [];
// for (let i = 0; i < 23; i++) {
//   listData.push({
//     href: 'http://ant.design',
//     title: `ant design part ${i}`,
//     avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
//     description:
//       'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//     content:
//       'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
//   });
// }

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

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
            dataList: state.resource.dataList,
            pageIndex: state.resource.pageIndex,
            totalCount: state.resource.totalCount,
            // addOilModalVisible: state.oilstation.addOilModalVisible,
        };
    },
    mapDispatchToProps
)
class OilPerson extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            content: `确定删除记录${record.name} ？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                // 删除油站
                const { delEntity } = that.props;
                delEntity(record.id).then(res => {
                    const { status } = res;
                    if (status === "OK") {
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
            pageIndex: page,
            pageSize: PAGE_SIZE,
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
    showChangeEntityModal = record => {//打开资源
        const { updateModal } = this.props;
        updateModal(record);
    };

    showBindStationModal = item => {
        // 绑定油站弹窗
        const { modifyRelatedStationModal } = this.props;
        // todo
        modifyRelatedStationModal(item);
    };
    
    renderItem = (item) =>{
        console.log(item)
        const {name,imgList,code,extraInformation} = item;
        const imgs = parseImgListStr(imgList)
        return (<List.Item
            key={item.id}
            onClick={()=>this.showChangeEntityModal(item)}
            extra={<Button onClick={(e) => {e.stopPropagation();this.DeleteEntity(item)}}>删除</Button>}
            >
            <div >
                <img src={imgs[0]} style={{width:'90px',height:'90px'}}/>
                <p>{code}</p>
                <p>{name}</p>
                <p>{extraInformation}</p>
            </div>
        </List.Item>)
    } 

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
        const searchAction = (
            <div>
                <Search
                    placeholder="请输入手机号或用户名查询..."
                    enterButton="查询"
                    value={searchText}
                    allowClear
                    onChange={this.search}
                    style={{ width: '20vw', marginRight: 5 }}
                />
            </div>
        );
        const addAction = (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span style={{ fontSize: 20, fontWeight: 'bold', display: 'flex' }}>资源列表</span>
                <Button
                    type="primary"
                    style={{ marginLeft: 20 }}
                    onClick={() => this.showAddModal()}
                >
                    新建
                </Button>
            </div>
        );
        return (
            <div>
                <Card extra={searchAction} title={addAction}>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        current: pageIndex,
                        pageSize: PAGE_SIZE,
                        total: totalCount,
                        onChange: this.onPageChange,
                    }}
                    dataSource={datas}
                    footer={
                    <div>
                        <b></b>
                    </div>
                    }
                    renderItem={this.renderItem}
                />
                </Card>
                <CreateEntityModal />
            </div>
        );
    }
}
export default OilPerson;
