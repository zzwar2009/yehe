/* eslint-disable */
import React, { Component } from 'react';
import { Input, Modal, DatePicker, Row, Col, Form, message, Select,Icon,Button  } from 'antd';
import { connect } from 'dva';
import { bindActionCreator } from '@/utils/bindActionCreators';
import { queryList, showModal, createEntity, CreateModal, UpdateStation } from './actionCreater';
import { PAGE_SIZE } from './const';
import RoleSelect from '@/pages/components/RoleSelect';
import StatusSelect from '@/pages/components/StatusSelect';
import PicturesWall from '@/pages/components/PicturesWall/index';
import moment from 'moment';
import { formatToUTC, checkField } from '@/utils/utils';


const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
const { confirm } = Modal;
// import styles from './OilStation.css';
let id = 0;
let cid = 0;
const fileList = [
    {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-4',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-5',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
]
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
    ({ activemessage }) => {
        return {
            addOilModalVisible: activemessage.addOilModalVisible,
            actiontype: activemessage.actiontype, // 代表是  create还是update
            data: activemessage.formdata, // 表单的初始值，更新会回填原来的值
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
                    content: `确定修改？`,
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

    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    removeCard = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('ckeys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            ckeys: keys.filter(key => key !== k),
        });
    };

    addCard = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('ckeys');
        const nextKeys = keys.concat(cid++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            ckeys: nextKeys,
        });
    };

    

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
            const { keys, names, cnames,ckeys} = values;
            console.log('Received values of form: ', values);
            console.log('Merged values:', keys.map(key => names[key]));
            // console.log('Merged card values :', ckeys.map(key => cnames[key]));
            }
        });
    };

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          },
        };
        const formItemLayoutWithOutLabel = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
          },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
          <Form.Item
            // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '文本消息' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input passenger's name or delete this field.",
                },
              ],
            })(<textarea placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Form.Item>
        ));


        getFieldDecorator('ckeys', { initialValue: [] });
        const ckeys = getFieldValue('ckeys');
        const cardFormItems = ckeys.map((k, index) => (
          <Form.Item
            // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? '资源卡片' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`cnames[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input passenger's name or delete this field.",
                },
              ],
            })(<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.removeCard(k)}
              />
            ) : null}
          </Form.Item>
        ));


        const { addOilModalVisible, form, actiontype, data } = this.props;
        // const { getFieldDecorator } = form;
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
            update: '修改回复',
            create: '配置回复',
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
        // let userNameDom = ''; // 用户姓名
        // let userMobileDom = ''; // 用户手机
        // let userPwdDom = ''; // 用户密码
        // let userStatusDom = ''; // 用户状态
        // let userRoleDom = ''; // 用户角色
        let userIdDom = ''; // 用户id
        
        let picWall  = ''; //图片

        picWall = getFieldDecorator('fileList', {
            initialValue: fileList,
            // valuePropName:'filelist'
        })(<PicturesWall />);

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

            // userNameDom = getFieldDecorator('nicknamenative', {
            //     rules: [{ required: true, message: '请输入姓名' }],
            //     initialValue: nicknamenative,
            // })(<Input type="text" placeholder="请输入姓名" />);

            // userMobileDom = getFieldDecorator('mobile', {
            //     rules: [
            //         { required: true, message: '请输入手机号码' },
            //         {
            //             // validator: checkField(/^1(3|4|5|7|8)\d{9}$/, '手机号码有误，请重填写'),
            //             validator: checkField(/^1\d{10}$/, '手机号码有误，请重填写'),
            //         },
            //     ],
            //     initialValue: mobile,
            // })(<Input type="text" placeholder="请输入手机号码" />);

            // userPwdDom = getFieldDecorator('password', {
            //     rules: [{ required: true, message: '请输入登录密码' }],
            //     initialValue: password,
            // })(<Input type="text" placeholder="请输入登录密码" />);

            // userStatusDom = getFieldDecorator('status', {
            //     rules: [{ required: true, message: '请选择状态' }],
            //     initialValue: status,
            // })(<StatusSelect />);

            // userRoleDom = getFieldDecorator('role', {
            //     rules: [{ required: true, message: '请选择角色' }],
            //     initialValue: role,
            // })(<RoleSelect />);
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

            // userNameDom = getFieldDecorator('nicknamenative', {
            //     rules: [{ required: true, message: '请输入姓名' }],
            //     initialValue: nicknamenative,
            // })(<Input type="text" placeholder="请输入姓名" />);

            // userMobileDom = getFieldDecorator('mobile', {
            //     rules: [
            //         { required: true, message: '请输入手机号码' },
            //         {
            //             // validator: checkField(/^1(3|4|5|7|8)\d{9}$/, '手机号码有误，请重填写'),
            //             validator: checkField(/^1\d{10}$/, '手机号码有误，请重填写'),
            //         },
            //     ],
            //     initialValue: mobile,
            // })(<Input type="text" placeholder="请输入手机号码" />);

            // userPwdDom = '';

            // userStatusDom = getFieldDecorator('status', {
            //     rules: [{ required: true, message: '请选择状态' }],
            //     initialValue: status,
            // })(<StatusSelect />);

            // userRoleDom = getFieldDecorator('role', {
            //     rules: [{ required: true, message: '请选择角色' }],
            //     initialValue: role,
            // })(<RoleSelect />);
        }

        return (
            <Modal
                title={titleObj[actiontype]}
                visible={addOilModalVisible}
                onOk={this.handleSubmit}
                confirmLoading={false}
                onCancel={this.onCancel}
                width="80%"
                okText="发送"
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
                        <Col span={24}>
                            <Form.Item >
                                <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                    <Icon type="plus" /> Add field
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                        {formItems}
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                            {picWall}
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                            <Form.Item>
                                <Button type="dashed" onClick={this.addCard} style={{ width: '60%' }}>
                                    <Icon type="plus" /> Add field
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                        {cardFormItems}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
const WrappedForm = Form.create({})(createStationModal);
export default WrappedForm;
