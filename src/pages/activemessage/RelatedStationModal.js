/* eslint-disable */
import React, { Component } from 'react';
import { Input, Modal, Row, Col, Form, message, Button } from 'antd';
import { connect } from 'dva';
import { bindActionCreator } from '@/utils/bindActionCreators';
import { showRelatedStationModal, bindStation } from './actionCreater';
import { PAGE_SIZE } from './const';
import RoleSelect from '@/pages/components/RoleSelect';
import StationSelect from '@/pages/components/StationSelect';
import UserRelatedStations from '@/pages/components/UserRelatedStations';

// import styles from './OilStation.css';

const namespace = 'userrs';
function queryList(payload) {
    return {
        type: `${namespace}/queryList`,
        payload,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        refreshRsList: bindActionCreator(queryList, dispatch),
        bindStation: bindActionCreator(bindStation, dispatch),
        showRelatedStationModal: bindActionCreator(showRelatedStationModal, dispatch),
    };
}
@connect(
    ({ refuelworker }) => {
        return {
            visible: refuelworker.relatedStationModalVisible,
            data: refuelworker.relatedStationFormdata,
        };
    },
    mapDispatchToProps
)
class pwdModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    onOk = () => {};

    refreshBindList = () => {
        //刷新绑定列表
        const { refreshRsList, data } = this.props;
        const { userid } = data;
        refreshRsList({
            // pageIndex: page,
            // pageSize: PAGE_SIZE,
            userid,
            // where: where || {},
        });
    };

    closeModal = () => {
        // 关闭弹窗
        const { showRelatedStationModal } = this.props;
        showRelatedStationModal(false);
    };

    onCancel = () => {
        this.closeModal();
    };

    StationChange = (id, item) => {
        // 油站变化
        //获取油站编号
        const { supplierASCode } = item;
        // if (actiontype === 'create') {
        //     CreateModal(item);
        // }else{
        //     debugger
        // UpdateStation(item);
        // }
    };

    bindStationClick = () => {
        //绑定油站
        let that = this;
        const { data, form, bindStation } = this.props;
        const { getFieldValue } = form;
        const { userid } = data;
        const supplierASCode = getFieldValue('supplierASCode');

        if (!supplierASCode) {
            message.warn('请先选择绑定的油站');
            return;
        }
        bindStation({ userid, supplierASCode }).then(res => {
            const { code } = res;
            if (code === 200) {
                message.success('绑定成功');

                //刷新关联的列表
                that.refreshBindList();
                //关闭弹窗
                // that.closeModal();
            } else {
                message.error(res.message || '绑定失败');
            }
        });
    };

    render() {
        const { visible, data, form } = this.props;
        const { getFieldDecorator } = form;
        const { nicknamenative, userid, role, station, roleDescription } = data;
        let userIdDom = ''; // 用户编号
        let userNameDom = ''; // 用户姓名
        let userRoleDom = ''; // 用户角色
        let stationDom = ''; //  关联油站
        userIdDom = getFieldDecorator('userid', {
            initialValue: userid,
        })(<Input type="text" disabled />);

        userNameDom = getFieldDecorator('nicknamenative', {
            initialValue: nicknamenative,
        })(<Input type="text" disabled />);
        console.log(roleDescription);
        userRoleDom = getFieldDecorator('roleDescription', {
            initialValue: roleDescription,
        })(<Input type="text" disabled />);

        stationDom = getFieldDecorator('supplierASCode', {
            initialValue: '',
        })(<StationSelect onChange={this.StationChange} />);

        return (
            <Modal
                title={'油站绑定'}
                visible={visible}
                onOk={this.onOk}
                confirmLoading={false}
                onCancel={this.onCancel}
                width={700}
                okText="关闭"
                footer={null}
                cancelText=""
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form>
                    <Row type="flex" gutter={16}>
                        <Col span={8}>
                            <Form.Item label="用户编号">{userIdDom}</Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="用户姓名">{userNameDom}</Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="用户角色">{userRoleDom}</Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                            <Form.Item label="关联油站">
                                <Row type="flex" gutter={16}>
                                    <Col span={20}>{stationDom}</Col>
                                    <Col span={4}>
                                        <Button type="primary" onClick={this.bindStationClick}>
                                            绑定
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <UserRelatedStations userid={userid} />
                    </Row>
                </Form>
            </Modal>
        );
    }
}
const WrappedForm = Form.create({})(pwdModal);
export default WrappedForm;
