/* eslint-disable */
import React, { Component } from 'react';
import { Input, Modal, Row, Col, Form, message } from 'antd';
import { connect } from 'dva';
import { bindActionCreator } from '@/utils/bindActionCreators';
import { queryList, showPwdModal, changePwd } from './actionCreater';
import { PAGE_SIZE } from './const';
// import styles from './OilStation.css';

function mapDispatchToProps(dispatch) {
    return {
        // queryList: bindActionCreator(queryList, dispatch),
        changePwd: bindActionCreator(changePwd, dispatch),
        showPwdModal: bindActionCreator(showPwdModal, dispatch),
    };
}
@connect(
    ({ refuelworker }) => {
        return {
            changePwdModalVisible: refuelworker.changePwdModalVisible,
            userid: refuelworker.changePwdUserid,
        };
    },
    mapDispatchToProps
)
class pwdModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // confirmLoading:false,
        };
    }

    componentDidMount() {}

    onOk = () => {
        const { form } = this.props;
        let that = this;
        const { getFieldsValue, validateFields, getFieldError } = form;
        validateFields((error, values) => {
            if (error) {
                return;
            }

            that.updatePwd(values);
        });
    };

    updatePwd = formData => {
        let that = this;
        const { changePwd, userid } = this.props;

        const { pwd, pwd2 } = formData;

        if (pwd != pwd2) {
            message.error('两次输入必须一致');
            return;
        }
        let queryData = {
            userid,
            pwd,
            pwd2,
        };
        changePwd(queryData).then(res => {
            const { code } = res;
            if (code === 200) {
                message.success('提交成功');

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
        const { showPwdModal } = this.props;
        showPwdModal(false);
    };

    onCancel = () => {
        this.closeModal();
    };

    render() {
        const { changePwdModalVisible, changePwdUserid, form } = this.props;
        const { getFieldDecorator } = form;

        let userPwdDom = ''; // 新密码
        let userPwdTwiceDom = ''; // 再次输入新密码

        userPwdDom = getFieldDecorator('pwd', {
            rules: [{ required: true, message: '请输入密码' }],
            initialValue: '',
        })(<Input type="number" placeholder="请输入密码" />);

        userPwdTwiceDom = getFieldDecorator('pwd2', {
            rules: [{ required: true, message: '请再次输入密码' }],
            initialValue: '',
        })(<Input type="number" placeholder="请再次输入密码" />);

        return (
            <Modal
                title={'修改登录密码'}
                visible={changePwdModalVisible}
                onOk={this.onOk}
                confirmLoading={false}
                onCancel={this.onCancel}
                width="80%"
                okText="确定"
                maskClosable={false}
            >
                <Form>
                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                            <Form.Item label="新密码">{userPwdDom}</Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                            <Form.Item label="再次输入新密码">{userPwdTwiceDom}</Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
const WrappedForm = Form.create({})(pwdModal);
export default WrappedForm;
