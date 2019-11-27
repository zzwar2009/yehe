import { Form, Tabs } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import { getVerifyImg} from '@/services/login';
import styles from './VerifyCode.less';

class VerifyCode extends Component {
 

  constructor(props) {
    super(props);
    this.state = {
      img:''
    };
  }

  componentDidMount() {
    getVerifyImg().then(function(res){
        debugger
    })
  }

  

  render() {
    
    return (
      <div>1111</div>
    );
  }
}
export default VerifyCode;
