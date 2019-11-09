/* eslint-disable */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Icon from './ui/icon';
import Input from './ui/input';
var classNames = require('classnames');
const size = 5; //每页条数
import { getSupplierList } from '@/services/supplierlist.api';

import style from './index.less';
const commonAllStr = '搜索供应商名称';
var querystring = require('querystring');
function getVisitorListByNickname(queryData) {
    queryData.pageIndex = queryData.page;
    queryData.pageSize = queryData.size;
    delete queryData.size;
    delete queryData.page;
    if (queryData.name) {
        queryData.where = {
            supplierName: `like[${queryData.name}]`, // 供应商名称模糊查询
        };
        delete queryData.name;

        // supplierCode
    } else if (queryData.cId) {
        queryData.where = {
            id: queryData.cId, // 精确查找
        };
        delete queryData.name;
    } else {
        queryData.where = {};
        delete queryData.name;
    }
    delete queryData.cId;
    console.log('queryData', queryData);
    return getSupplierList(queryData);
}
//点击空白收起
function close(e) {
    //如果点击在此组件之外则执行 && 只有组件打开的时候执行
    if (!isInComponent(e.target, 'datalist-wrap') && this.state.opened == true) {
        var state = Object.assign({}, this.state);
        state.opened = false;
        // console.log(this.searchword)
        if (this.prevValue) {
            state.value = this.prevValue; //恢复原来的值但搜索的时候
            state.nickname = this.prevNickname; //恢复原来的值对应显示
        }
        this.setState(state);
    }
}
/*
* 判断元素是否在给定的范围内
* scopecls  范围的class 
*/
function isInComponent(elem, scopecls) {
    let find = false;
    while (elem.parentNode) {
        elem = elem.parentNode;
        if (elem.className == scopecls) {
            //找到目标
            find = true;
            break;
        }
    }
    return find;
}
//坐席海量数据选择时使用
export default class StaffListSelect extends Component {
    constructor(props) {
        super(props);
        this.prevValue = undefined;
        this.prevNickname = '';
        this.searchword = ''; //搜索词
        // this.data = [];//数据集合
        this.state = {
            disabled: props.disabled,
            showClose: false,
            value: undefined,
            nickname: '',
            data: [],
            loading: false, //加载中
            hasmore: false, //是否有下一页
            opened: false, //列表是否打开
            totalPages: undefined, //总页数
            currentpage: undefined, //当前页数
        };
        document.addEventListener('click', close.bind(this), true);
    }
    componentWillReceiveProps(nextProps) {
        let that = this;
        let value;
        if ('value' in nextProps) {
            if (this.state.value != nextProps.value) {
                value = nextProps.value;
                //千辛万苦都是为了查找nickname
                if (value) {
                    let queryData = {
                        page: 1,
                        size: 10000,
                        supplierCode: value,
                    };
                    getVisitorListByNickname(queryData).then(function(res) {
                        const { code, result } = res;
                        if (code == 200) {
                            for (let i = 0; i < result.length; i++) {
                                let { supplierName, supplierCode, id } = result[i];
                                if (id == value) {
                                    var state = Object.assign({}, that.state);
                                    state.nickname = supplierName;
                                    state.value = id;
                                    that.setState(state);
                                    break;
                                }
                            }
                            //请求成功修改数据驱动视图
                            // var state = Object.assign({},that.state);
                            // let {tenantId,nickname,username} = item;
                            // nickname =  nickname ? nickname : username;
                            // item.nickname = nickname;
                            // state.value = value;
                            // state.nickname = true;
                            // that.setState(state);
                        }
                    });
                } else {
                    var state = Object.assign({}, that.state);
                    state.nickname = '';
                    state.value = '';
                    that.setState(state);
                }
            }
        }
    }
    componentDidMount() {
        console.log('selectComponent ======', this.props.value);
        let that = this;
        let value;
        if ('value' in this.props) {
            value = this.props.value;
        } else if ('defaultValue' in this.props) {
            value = this.props.defaultValue;
        }

        //千辛万苦都是为了查找nickname
        if (value) {
            let queryData = {
                page: 1,
                size: 10000,
                cId: value,
            };

            getVisitorListByNickname(queryData).then(function(res) {
                console.log('getListbynickname', res);
                const { code, result } = res;
                if (code == 200) {
                    for (let i = 0; i < result.length; i++) {
                        let { supplierCode, supplierName, id } = result[i];
                        if (id == value) {
                            var state = Object.assign({}, that.state);
                            state.nickname = supplierName;
                            state.value = value;
                            that.setState(state);
                            break;
                        }
                    }
                    //请求成功修改数据驱动视图
                    // var state = Object.assign({},that.state);
                    // let {id,nickname,username} = item;
                    // nickname =  nickname ? nickname : username;
                    // item.nickname = nickname;
                    // state.value = value;
                    // state.nickname = true;
                    // that.setState(state);
                }
            });
        }
    }
    //请求数据方法
    request(page, size, nickname) {
        let that = this;

        let queryData = { page: page, size: size, name: nickname };
        var state = Object.assign({}, that.state);
        state.loading = true;
        state.opened = true;
        state.nickname = nickname;
        that.setState(state);
        getVisitorListByNickname(queryData).then(function(res) {
            const { result, code, totalCount } = res;
            if (code == 200) {
                //请求成功修改数据驱动视图
                var state = Object.assign({}, that.state);
                if (page == 1) {
                    //第一页可能是重新搜索的所以不用组合上次结果
                    state.data = result;
                } else {
                    state.data = state.data.concat(result);
                }
                state.loading = false;
                state.opened = true;

                const totalPages = Math.ceil(totalCount / size);
                state.hasmore = parseInt(totalPages) >= parseInt(page) + 1;
                state.totalPages = parseInt(totalPages);
                state.currentpage = parseInt(page);
                that.setState(state);
            } else {
                //请求失败情况
            }
        });
    }
    onSelect(item) {
        this.prevValue = this.state.value;
        this.prevNickname = this.state.nickname;

        //选择某个结果
        var state = Object.assign({}, this.state);
        let id = item.id;
        let data = state.data;
        state.opened = false;
        state.value = id;
        state.data = [];
        for (let i = 0; i < data.length; i++) {
            let { supplierCode, supplierName, id } = data[i];
            if (id == state.value) {
                state.nickname = supplierName;
                break;
            }
        }
        //其他值应该恢复到初始状态这次选择结束
        this.setState(state);
        if (this.props.onChange) {
            this.props.onChange(item.id, item);
        }
    }
    search(e) {
        //模糊搜索昵称
        let search = e.target.value;
        this.searchword = search;
        this.request(1, size, this.searchword);
    }
    loadmore(page) {
        //加载下一页
        // console.log('加载下一页：'+page+"对用户来说是第"+parseInt(page+1)+"页");
        this.request(page, size, this.searchword);
    }
    onFocus(e) {
        if (this.state.value) {
            //选了值 再打开清掉上次的值
            this.searchword = ''; //清除上一次的搜索词
            //已经选过值得情况
            let target = e.target;
            this.prevValue = this.state.value;
            this.prevNickname = this.state.nickname;
            var state = Object.assign({}, this.state);
            state.value = undefined;
            state.nickname = '';
            state.showClose = false;
            state.opened = true;
            this.setState(state);

            let that = this;
            //每次打开都是重新开始
            setTimeout(function() {
                that.request(1, size, that.searchword);
            }, 30);
        } else {
            this.searchword = ''; //清除上一次的搜索词
            var state = Object.assign({}, this.state);
            state.value = undefined;
            state.nickname = '';
            state.opened = true;
            state.showClose = false;
            this.setState(state);
            //没选值不清除searchword下次打开在搜索词结果第一页
            //没有值就初始化
            this.request(1, size, this.searchword);
        }
    }
    renderClose() {
        //显示close icon
        if (this.state.value == undefined) {
            //如果没有值也没必要显示close icon
            return;
        }
        var state = Object.assign({}, this.state);
        state.showClose = true;
        if (state.value == undefined) {
            //showClose和value是有一定关系的 没有值时没必要显示关闭，有值的时候可以显示隐藏控制
            state.showClose = false;
        }
        this.setState(state);
    }
    removeClose() {
        //隐藏close icon
        var state = Object.assign({}, this.state);
        if (state.showClose != false) {
            state.showClose = false;
            this.setState(state);
        }
    }
    clear() {
        //清除结果回到初始化状态,清除所选和搜索
        var state = Object.assign({}, this.state);
        state.value = undefined;
        state.showClose = false;
        state.nickname = '';
        state.data = [];
        this.prevValue = undefined;
        this.prevNickname = '';
        this.setState(state);
        //应该回调为空字符串
        if (this.props.onChange) {
            this.props.onChange('', {});
        }
    }
    render() {
        const {
            disabled,
            data,
            hasmore,
            loading,
            opened,
            totalPages,
            currentpage,
            value,
            nickname,
            showClose,
        } = this.state;
        let lis = [];
        let that = this;
        // this.data = this.data.concat(data);
        lis = data.map(function(item, i) {
            let { supplierName, supplierCode, id } = item;
            return (
                <li
                    key={i}
                    className="ellipsis"
                    onClick={function() {
                        return that.onSelect(item);
                    }}
                >
                    {supplierName}({id})
                </li>
            );
        });
        if (loading) {
            lis.push(
                <li key={'loading'} className="list-more-btn">
                    <div className="loading-sticks positioning">
                        <div className="loading" />
                        <div className="loading" />
                        <div className="loading" />
                    </div>
                </li>
            );
        } else if (hasmore) {
            //有下一页情况
            lis.push(
                <li
                    key={'loadmore'}
                    className="list-more-btn"
                    onClick={function() {
                        return that.loadmore(parseInt(currentpage) + 1);
                    }}
                >
                    加载更多
                </li>
            );
        }
        if (totalPages == 0) {
            lis.push(<li key={'notfound'}>没有数据</li>);
        }

        let clsNames = classNames('input-query-list', { hide: !opened });

        let input;
        if (showClose) {
            input = (
                <Input
                    value={nickname}
                    placeholder={commonAllStr}
                    onChange={this.search.bind(this)}
                    suffix={<Icon type="delx" onClick={this.clear.bind(this)} />}
                />
            );
        } else {
            input = (
                <Input
                    value={nickname}
                    placeholder={commonAllStr}
                    suffix={<Icon type="search-large" />}
                    onChange={this.search.bind(this)}
                />
            );
        }

        let wrapCls = classNames('datalist-wrap', { disabled: disabled });
        let dom = (
            <div
                className={wrapCls}
                onFocus={this.onFocus.bind(this)}
                onMouseEnter={this.renderClose.bind(this)}
                onMouseLeave={this.removeClose.bind(this)}
            >
                {input}
                <ul className={clsNames}>{lis}</ul>
            </div>
        );
        return dom;
    }
}
