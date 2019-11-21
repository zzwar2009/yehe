/* eslint-disable */
import React, { Component } from 'react';
import { Input, Modal, DatePicker, Row, Col, Form, message, Select,Upload,Icon,Button } from 'antd';
import { connect } from 'dva';
import { bindActionCreator } from '@/utils/bindActionCreators';
import { queryList, showModal, createEntity, CreateModal, UpdateStation ,queryEntity} from './actionCreater';
import { PAGE_SIZE } from './const';
import RoleSelect from '@/pages/components/RoleSelect';
import StatusSelect from '@/pages/components/StatusSelect';
import PicturesWall from '@/pages/components/PicturesWall/index';
import moment from 'moment';
import { formatToUTC, checkField } from '@/utils/utils';
import { parseImgListStr,getArrayfromLength } from '@/utils/utils';

const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
const { confirm } = Modal;
// let id = 0;
// import styles from './OilStation.css';

function mapDispatchToProps(dispatch) {
    return {
        queryList: bindActionCreator(queryList, dispatch),
        showModal: bindActionCreator(showModal, dispatch),
        createEntity: bindActionCreator(createEntity, dispatch),
        queryEntity: bindActionCreator(queryEntity, dispatch),
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

    componentDidMount() {
        
        // query entity
        const { queryEntity } = this.props;
        queryEntity();
    }

    onOk = () => {
        const {form } = this.props;
        let that = this;
        const { getFieldsValue, validateFields, getFieldError } = form;
        validateFields((error, values) => {
            if (error) {
                return;
            }
            
            console.log(values)
            console.log('==================')
            // console.log(newvalues);
            // if (actiontype === 'create') {
            //     that.createEntityBefore(values);
            // } else {
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
                // debugger
                that.updateEntity(values);
            // }
        });
    };

    updateEntity = formData => {
        let that = this;
        const { createEntity } = this.props;

        const {
            imgList,
            replyExtendsList,
        } = formData;
        
        let queryData = {
            imgList,
            replyExtendsList,
        };

        createEntity(queryData).then(res => {
            const { status } = res;
            if (status === "OK") {
                message.success('提交成功');

                //刷新列表
                that.refreshList();
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
        const { queryEntity } = this.props;
        queryEntity();
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

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(keys.length);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    // handleSubmit = e => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         if (!err) {
    //         const { keys, names } = values;
    //         console.log('Received values of form: ', values);
    //         console.log('Merged values:', keys.map(key => names[key]));
    //         }
    //     });
    // };

    render() {
        const { form, data } = this.props;
        // const { getFieldDecorator } = form;
        const {
            id,
            imgList,
            replyExtendsList
        } = data;
        const { getFieldDecorator, getFieldValue } = form;
        // getFieldDecorator('keys', { initialValue: [] });

        
        getFieldDecorator('keys', { initialValue: getArrayfromLength(replyExtendsList) });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
          <Form.Item
            label={index === 0 ? '文本消息' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`replyExtendsList[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "请输入文本消息或删除此项",
                },
              ],
              initialValue:replyExtendsList[index]
            })(<textarea placeholder="请输入文本消息" style={{ width: '60%', marginRight: 8 }} />)}
            {
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            }
          </Form.Item>
        ));

        
        

        let picWall  = ''; //图片


        picWall = getFieldDecorator('imgList', {
            initialValue: parseImgListStr(imgList),
            // valuePropName:'filelist'
        })(<PicturesWall />);

        


        return (
            <Form >
                <Form.Item>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> 添加文本消息
                    </Button>
                </Form.Item>
                {formItems}

                <Row type="flex" gutter={16}>
                    <Col span={24}>
                        {picWall}
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" onClick={this.onOk}>
                        保存配置
                    </Button>
                </Form.Item>
            </Form>
            
        );
    }
}
const WrappedForm = Form.create({})(createStationModal);
export default WrappedForm;
