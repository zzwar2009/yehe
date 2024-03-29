/* eslint-disable */
import React, { Component } from 'react';
import { Input, Modal, DatePicker, Row, Col, Form, message, Select,Upload,Icon } from 'antd';
import { connect } from 'dva';
import { bindActionCreator } from '@/utils/bindActionCreators';

import { parseImgListStr } from '@/utils/utils';

import { queryList, showModal, createEntity,updatEntity, CreateModal, UpdateStation } from './actionCreater';
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

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// const fileList = [
//     {
//       uid: '-1',
//       name: 'image.png',
//       status: 'done',
//       url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//     {
//       uid: '-2',
//       name: 'image.png',
//       status: 'done',
//       url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//     {
//       uid: '-3',
//       name: 'image.png',
//       status: 'done',
//       url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//     {
//       uid: '-4',
//       name: 'image.png',
//       status: 'done',
//       url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//     {
//       uid: '-5',
//       name: 'image.png',
//       status: 'done',
//       url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     },
//   ]

function mapDispatchToProps(dispatch) {
    return {
        queryList: bindActionCreator(queryList, dispatch),
        showModal: bindActionCreator(showModal, dispatch),
        createEntity: bindActionCreator(createEntity, dispatch),
        updatEntity: bindActionCreator(updatEntity, dispatch),
        
        CreateModal: bindActionCreator(CreateModal, dispatch),
        UpdateStation: bindActionCreator(UpdateStation, dispatch),
    };
}
@connect(
    ({ resource }) => {
        return {
            addOilModalVisible: resource.addOilModalVisible,
            actiontype: resource.actiontype, // 代表是  create还是update
            data: resource.formdata, // 表单的初始值，更新会回填原来的值
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
        const { updatEntity } = this.props;

        const {
            describes,// 描述
            extraInformation,// 附属信息
            fileFormat,// 文件格式
            id,// 编号
            code,
            imgList,// 图片列表
            name, // 资源名称
            tag,// 标签
            type,// 资源类型
            years // 年代
        } = formData;
        const { userid } = this.props.data;
        let queryData = {
            code,
            describes,// 描述
            extraInformation,// 附属信息
            fileFormat,// 文件格式
            id,// 编号
            imgList,// 图片列表
            name, // 资源名称
            tag,// 标签
            type,// 资源类型
            years // 年代
        };
        updatEntity(queryData).then(res => {
            const { status } = res;
            if (status === "OK") {
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
            describes,// 描述
            extraInformation,// 附属信息
            fileFormat,// 文件格式
            id,// 编号
            imgList,// 图片列表
            name, // 资源名称
            tag,// 标签
            type,// 资源类型
            years // 年代
        } = formData;

        let queryData = {
            describes,// 描述
            extraInformation,// 附属信息
            fileFormat,// 文件格式
            imgList,// 图片列表
            name, // 资源名称
            tag,// 标签
            type,// 资源类型
            years // 年代
        };
        createEntity(queryData).then(res => {
            const { status } = res;
            if (status === "OK") {
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
            clickNum,
            describes,// 描述
            extraInformation,// 附属信息
            fileFormat,// 文件格式
            id,// 编号
            imgList,// 图片列表
            name, // 资源名称
            tag,// 标签
            type,// 资源类型
            years, // 年代
            code
        } = data;
        // const { startDT, supplierASCode, supplierASName, regionName } = station;
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
            update: '修改资源',
            create: '新建资源',
        };
        //moment类型
        let dateValue = null;

        // if (actiontype === 'create') {
        //     dateValue = moment(new Date(), dateFormat);

        // }else
        // if (startDT && startDT !== '0001-01-01T00:00:00') {
        //     dateValue = moment(startDT, dateFormat);
        // } else {
        //     dateValue = '';
        // }

        // let stationDom = ''; // 油站选择
        // let startDTDom = ''; // 合作时间
        // let regionNameDom = ''; // 省区
        let userNameDom = ''; // 用户姓名
        let userMobileDom = ''; // 用户手机
        let userPwdDom = ''; // 用户密码
        let userStatusDom = ''; // 用户状态
        let userRoleDom = ''; // 用户角色
        let userIdDom = ''; // 用户id


        let resName = '';// 资源名称
        let resCode = '';// 资源编号
        let resExtra = '';// 附属信息

        let restypeDom = '';// 资源类型
        let fileFormatDom = '';// 文件格式
        let descDom = '';// 描述
        let tagDom = '';// 标签
        let timeDom = '';// 年代
        let resId = '';
        let picWall  = ''; //图片
        // console.log(imgList)
        // console.log(typeof imgList)
        // let imgListArr = [];
        // if(imgList && typeof imgList =='string' && imgList.length>0){
        //     imgListArr = JSON.parse(imgList);
        // }
        
        picWall = getFieldDecorator('imgList', {
            initialValue: parseImgListStr(imgList),
            // valuePropName:'filelist'
        })(<PicturesWall />);

        // picWall = <PicturesWall />



        // describes,// 描述
        //     extraInformation,// 附属信息
        //     fileFormat,// 文件格式
        //     id,// 编号
        //     imgList,// 图片列表
        //     name, // 资源名称
        //     tag,// 标签
        //     type,// 资源类型
        //     years // 年代


        resName = getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入资源名称' }],
            initialValue: name,
        })(<Input type="text" placeholder="请输入资源名称" />);

        resCode = getFieldDecorator('code', {
            initialValue: code,
        })(<Input type="text" placeholder="资源编号" disabled/>);

        resId = getFieldDecorator('id', {
            initialValue: id,
        })(<Input type="text" placeholder="资源编号" disabled/>);

        resExtra = getFieldDecorator('extraInformation', {
            rules: [{ required: true, message: '附属信息' }],
            initialValue: extraInformation,
        })(<Input type="text" placeholder="附属信息" />);



        restypeDom = getFieldDecorator('type', {
            rules: [{ required: true, message: '资源类型' }],
            initialValue: type,
        })(<Input type="text" placeholder="资源类型" />);

        fileFormatDom = getFieldDecorator('fileFormat', {
            rules: [{ required: true, message: '文件格式' }],
            initialValue: fileFormat,
        })(<Input type="text" placeholder="文件格式" />);

        descDom = getFieldDecorator('describes', {
            rules: [{ required: true, message: '描述' }],
            initialValue: describes,
        })(<Input type="text" placeholder="描述" />);

        tagDom = getFieldDecorator('tag', {
            rules: [{ required: true, message: '标签' }],
            initialValue: tag,
        })(<Input type="text" placeholder="标签" />);

        timeDom = getFieldDecorator('years', {
            rules: [{ required: true, message: '年代' }],
            initialValue: years,
        })(<Input type="text" placeholder="年代" />);



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
            // userIdDom = getFieldDecorator('userid', {
            //     initialValue: userid,
            // })(<Input type="text" disabled />);

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
                                <Form.Item label="用户编号">{resId}</Form.Item>
                            </Col>
                        </Row>
                    )}
                    
                    <Row type="flex" gutter={16}>
                        <Col span={12}>
                            <Form.Item label="资源名称">{resName}</Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="资源编号">{resCode}</Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={12}>
                            <Form.Item label="附属信息">{resExtra}</Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="资源类型">{restypeDom}</Form.Item>
                        </Col>
                    </Row>

                    <Row type="flex" gutter={16}>
                        <Col span={12}>
                            <Form.Item label="文件格式">{fileFormatDom}</Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="描述">{descDom}</Form.Item>
                        </Col>
                    </Row>

                    <Row type="flex" gutter={16}>
                        <Col span={12}>
                            <Form.Item label="标签">{tagDom}</Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="年代">{timeDom}</Form.Item>
                        </Col>
                    </Row>

                    <Row type="flex" gutter={16}>
                        <Col span={24}>
                            {/* <PicturesWall/> */}
                            {picWall}
                        </Col>
                        
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col span={12}>
                            <Form.Item label="点击量"><span>{clickNum}</span></Form.Item>
                        </Col>
                        
                    </Row>
                    {/* <Row type="flex" gutter={16}>
                        <Col span={24}>
                            <Form.Item label="用户角色">{userRoleDom}</Form.Item>
                        </Col>
                    </Row> */}
                </Form>
            </Modal>
        );
    }
}
const WrappedForm = Form.create({})(createStationModal);
export default WrappedForm;
