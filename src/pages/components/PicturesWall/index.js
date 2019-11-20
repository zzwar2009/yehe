import { Upload, Icon, Modal } from 'antd';
import UrlConfig from '@/config/host.config';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      value: props.value || [], // 默认是空数组
    };
  }
  
  componentWillReceiveProps(nextProps) {
      const value = nextProps.value || [];
      this.setState({
          value,
      });
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  // handleChange = ({ fileList }) => this.setState({ value:fileList });

  handleChange = (obj) => {
    
    const {fileList,file,event} = obj;
    let {value} = this.state;
    // console.log(obj)

    // if(file && file.response){
    //   const {status,entity} = file.response;
    //   if(status == 'OK'){
    //     file.url = file.entity;
    //     const {name,status,url,uid} = file;
    //     // value.push({
    //     //   name,
    //     //   status,
    //     //   uid,
    //     //   url,
    //     // })
        
    //   }
    // }

    // const {fiole}
    // this.setState({ fileList })
    // debugger
    // console.log(fileList)
    const { onChange } = this.props;
    // if (onChange) {
    //     onChange(value);
    // }
    // this.setState({ fileList })
    // this.setState({ fileList })
    if (onChange) {
      let filedatas  = fileList.map(function(item){
        let {uid,name,status,response,url=""} = item;
        if(response){
          const {status,entity} = response;
          if(status == 'OK'){
            url = entity;
          }
        }
        
        return {
          name,
          status,
          uid,
          url,
        }
      })
      onChange(filedatas);
    }
  };

  render() {
    const { previewVisible, previewImage, value } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const uploadurl = `${UrlConfig.new_host}image/uploadImg`
    return (
      <div className="clearfix">
        <Upload
          action={uploadurl}
          listType="picture-card"
          fileList={value}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {value.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;