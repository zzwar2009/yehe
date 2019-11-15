/* eslint-disable */
import React, { Component } from 'react';
import { Input, Modal, DatePicker, Row, Col, Form, message, Select } from 'antd';
import { connect } from 'dva';
import { bindActionCreator } from '@/utils/bindActionCreators';
import { queryList, showModal, createEntity, CreateModal, UpdateStation } from './actionCreater';
import { PAGE_SIZE } from './const';
import RoleSelect from '@/pages/components/RoleSelect';
import StatusSelect from '@/pages/components/StatusSelect';
import moment from 'moment';
import { formatToUTC, checkField } from '@/utils/utils';

const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
const { confirm } = Modal;
// import styles from './OilStation.css';

function mapDispatchToProps(dispatch) {
    return {
        queryList: bindActionCreator(queryList, dispatch),
        showModal: bindActionCreator(showModal, dispatch),
        createEntity: bindActionCreator(createEntity, dispatch),
        CreateModal: bindActionCreator(CreateModal, dispatch),
        UpdateStation: bindActionCreator(UpdateStation, dispatch),
    };
}
@connect(
    ({ loginlog }) => {
        return {
            addOilModalVisible: loginlog.addOilModalVisible,
            actiontype: loginlog.actiontype, // 代表是  create还是update
            data: loginlog.formdata, // 表单的初始值，更新会回填原来的值
        };
    },
    mapDispatchToProps
)
class createStationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // confirmLoading:false,
        };
    }

    componentDidMount() {}

    onOk = () => {
        const { addOilModalVisible, form, actiontype, data } = this.props;
        let that = this;
        const { getFieldsValue, validateFields, getFieldError } = form;
        validateFields((error, values) => {
            if (error) {
                return;
            }

            // console.log(newvalues);
            if (actiontype === 'create') {
                that.createEntityBefore(values);
            } else {
                confirm({
                    title: '提示',
                    content: `是否确定用户信息修改，若用户角色修改，测用户的油站绑定关系全部解除，需要重新绑定油站？`,
                    okText: '确定',
                    okType: 'primary',
                    cancelText: '取消',
                    onOk() {
                        that.updateEntity(values);
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            }
        });
    };

    updateEntity = formData => {
        let that = this;
        const { createEntity } = this.props;

        const {
            supplierASCode,
            supplierASName,
            nicknamenative,
            mobile,
            password,
            status,
            role,
        } = formData;
        const { userid } = this.props.data;
        let queryData = {
            role,
            userid: userid,
            supplierASCode: supplierASCode,
            supplierASName: supplierASName,
            nickNameNative: nicknamenative,
            loginName: mobile,
            tel: mobile,
            status: status,
            isLogin: 2, // 是否允许登陆：0-不允许；2-允许
        };
        createEntity(queryData).then(res => {
            const { code } = res;
            if (code === 200) {
                message.success('提交成功');

                //刷新列表
                that.refreshList();
                //关闭弹窗
                that.closeModal();
            } else {
                message.error(res.message || '提交失败');
            }
        });
    };

    createEntityBefore = formData => {
        let that = this;
        const { createEntity } = this.props;
        const {
            // supplierASCode,
            // supplierASName,
            nicknamenative,
            mobile,
            password,
            status,
            role,
        } = formData;
        let queryData = {
            // supplierASCode: supplierASCode,
            // supplierASName: supplierASName,
            nickNameNative: nicknamenative,
            loginName: mobile,
            tel: mobile,
            passWord: password,
            status: status,
            role, // 角色信息
            isLogin: 2, // 是否允许登陆：0-不允许；2-允许
        };
        createEntity(queryData).then(res => {
            const { code } = res;
            if (code === 200) {
                message.success('提交成功');

                //刷新列表
                that.refreshList();
                //关闭弹窗
                that.closeModal();
            } else {
                message.error(res.message || '提交失败');
            }
        });
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

    closeModal = () => {
        // 关闭弹窗
        const { showModal } = this.props;
        showModal(false);
    };

    onCancel = () => {
        this.closeModal();
    };

    render() {
        const { addOilModalVisible, form, actiontype, data } = this.props;
        const { getFieldDecorator } = form;
        const {
            userobjno, // 油站编号
            userobjname, // 油站名称
            mobile, // 手机号
            nicknamenative, // 用户姓名
            password, // 登录密码
            status, // 状态：默认开启
            station, // 所选油站的相关信息
            stationId, // 油站编码
            role,
            userid, // 用户id
        } = data;
        const { startDT, supplierASCode, supplierASName, regionName } = station;
        // let supplierASCode = 'fdsf'
        // let supplierASName = 'fdsf'
        // let regionName = 'fdsf'

        // Regions: regionName,// 所属省区
        //         StationIndex: supplierASCode,// 站点编号
        //         supplyFac, // 供应商
        //         StationName: supplierASName, // 站点名称
        //         StationType: '柴油',// 油站类型写死
        //         LatestPrice: oilPrice,// 最新油价
        //         StationBenefit: rebateRatio, // 油站返利比例
        //         DriverBenefit: oilRatio, // 司机返利比例
        //         StartTime: startDT, // 合作时间
        const titleObj = {
            update: '修改用户信息',
            create: '新建用户',
        };
        //moment类型
        let dateValue = null;

        // if (actiontype === 'create') {
        //     dateValue = moment(new Date(), dateFormat);

        // }else
        if (startDT && startDT !== '0001-01-01T00:00:00') {
            dateValue = moment(startDT, dateFormat);
        } else {
            dateValue = '';
        }

        // let stationDom = ''; // 油站选择
        // let startDTDom = ''; // 合作时间
        // let regionNameDom = ''; // 省区
        let userNameDom = ''; // 用户姓名
        let userMobileDom = ''; // 用户手机
        let userPwdDom = ''; // 用户密码
        let userStatusDom = ''; // 用户状态
        let userRoleDom = ''; // 用户角色
        let userIdDom = ''; // 用户id
        if (actiontype === 'create') {
            // stationDom = getFieldDecorator('stationId', {
            //     rules: [{ required: true, message: '请选择油站' }],
            //     initialValue: '',
            // })(<StationSelect onChange={this.StationChange} />);

            // startDTDom = getFieldDecorator('startDT', {
            //     initialValue: dateValue,
            // })(<DatePicker disabled />);

            // regionNameDom = getFieldDecorator('regionName', {
            //     initialValue: regionName,
            // })(<Input type="text" placeholder="请输入所属省区" disabled />);

            userNameDom = getFieldDecorator('nicknamenative', {
                rules: [{ required: true, message: '请输入姓名' }],
                initialValue: nicknamenative,
            })(<Input type="text" placeholder="请输入姓名" />);

            userMobileDom = getFieldDecorator('mobile', {
                rules: [
                    { required: true, message: '请输入手机号码' },
                    {
                        // validator: checkField(/^1(3|4|5|7|8)\d{9}$/, '手机号码有误，请重填写'),
                        validator: checkField(/^1\d{10}$/, '手机号码有误，请重填写'),
                    },
                ],
                initialValue: mobile,
            })(<Input type="text" placeholder="请输入手机号码" />);

            userPwdDom = getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入登录密码' }],
                initialValue: password,
            })(<Input type="text" placeholder="请输入登录密码" />);

            userStatusDom = getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择状态' }],
                initialValue: status,
            })(<StatusSelect />);

            userRoleDom = getFieldDecorator('role', {
                rules: [{ required: true, message: '请选择角色' }],
                initialValue: role,
            })(<RoleSelect />);
        } else if (actiontype === 'update') {
            // stationDom = getFieldDecorator('stationId', {
            //     rules: [{ required: true, message: '请选择油站' }],
            //     initialValue: stationId,
            // })(<StationSelect onChange={this.StationChange} />);

            // startDTDom = getFieldDecorator('startDT', {
            //     initialValue: dateValue,
            // })(<DatePicker disabled />);
            // regionNameDom = getFieldDecorator('regionName', {
            //     initialValue: regionName,
            // })(<Input type="text" placeholder="请输入所属省区" disabled />);
            userIdDom = getFieldDecorator('userid', {
                initialValue: userid,
            })(<Input type="text" disabled />);

            userNameDom = getFieldDecorator('nicknamenative', {
                rules: [{ required: true, message: '请输入姓名' }],
                initialValue: nicknamenative,
            })(<Input type="text" placeholder="请输入姓名" />);

            userMobileDom = getFieldDecorator('mobile', {
                rules: [
                    { required: true, message: '请输入手机号码' },
                    {
                        // validator: checkField(/^1(3|4|5|7|8)\d{9}$/, '手机号码有误，请重填写'),
                        validator: checkField(/^1\d{10}$/, '手机号码有误，请重填写'),
                    },
                ],
                initialValue: mobile,
            })(<Input type="text" placeholder="请输入手机号码" />);

            userPwdDom = '';

            userStatusDom = getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择状态' }],
                initialValue: status,
            })(<StatusSelect />);

            userRoleDom = getFieldDecorator('role', {
                rules: [{ required: true, message: '请选择角色' }],
                initialValue: role,
            })(<RoleSelect />);
        }

        return (
            <Modal
                title={titleObj[actiontype]}
                visible={addOilModalVisible}
                onOk={this.onOk}
                confirmLoading={false}
                onCancel={this.onCancel}
                width="80%"
                okText="确定"
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form>
                    {actiontype === 'update' && (
                        <Row type="flex" gutter={16}>
                            <Col span={24}>
                                <Form.Item label="用户编号">{userIdDom}</Form.Item>
                            </Col>
                        </Row>
                    )}
                    <Row type="flex" gutter={16}>
                        <Col span={12}>
                            <Form.Item label="用户姓名">{userNameDom}</Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="状态">{userStatusDom}</Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={12}>
                            <Form.Item label="手机号">{userMobileDom}</Form.Item>
                        </Col>
                        {actiontype === 'create' && (
                            <Col span={12}>
                                <Form.Item label="登录密码">{userPwdDom}</Form.Item>
                            </Col>
                        )}
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                            <Form.Item label="用户角色">{userRoleDom}</Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
const WrappedForm = Form.create({})(createStationModal);
export default WrappedForm;
