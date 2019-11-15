/* eslint-disable */
import React, { Component } from 'react';
import { Input, Modal, DatePicker, Row, Col, Form, message, Select,Upload,Icon,Button } from 'antd';
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
let id = 0;
// import styles from './OilStation.css';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

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
    ({ sayhi }) => {
        return {
            addOilModalVisible: sayhi.addOilModalVisible,
            actiontype: sayhi.actiontype, // 代表是  create还是update
            data: sayhi.formdata, // 表单的初始值，更新会回填原来的值
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
            console.log(values)
            // console.log(newvalues);
            if (actiontype === 'create') {
                that.createEntityBefore(values);
            } else {
                // confirm({
                //     title: '提示',
                //     content: `是否确定用户信息修改，若用户角色修改，测用户的油站绑定关系全部解除，需要重新绑定油站？`,
                //     okText: '确定',
                //     okType: 'primary',
                //     cancelText: '取消',
                //     onOk() {
                        
                //     },
                //     onCancel() {
                //         console.log('Cancel');
                //     },
                // });
                that.updateEntity(values);
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

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
            const { keys, names } = values;
            console.log('Received values of form: ', values);
            console.log('Merged values:', keys.map(key => names[key]));
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
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
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
        
        let picWall  = ''; //图片

        picWall = getFieldDecorator('fileList', {
            initialValue: fileList,
            // valuePropName:'filelist'
        })(<PicturesWall />);

        if (actiontype === 'create') {
            
        } else if (actiontype === 'update') {
            
        }

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> Add field
                    </Button>
                </Form.Item>
                {formItems}

                <Row type="flex" gutter={16}>
                    <Col span={24}>
                        {picWall}
                    </Col>
                </Row>
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="primary" htmlType="submit">
                        保存配置
                    </Button>
                </Form.Item>
            </Form>
            
        );
    }
}
const WrappedForm = Form.create({})(createStationModal);
export default WrappedForm;
