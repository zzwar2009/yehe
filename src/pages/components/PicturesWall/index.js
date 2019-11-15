import { Upload, Icon, Modal } from 'antd';

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
    this.setState({ fileList })
    const {fileList,file} = obj;
    console.log(obj)
    // debugger
    // console.log(fileList)
    const { onChange } = this.props;
        if (onChange) {
            onChange(fileList);
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
    return (
      <div className="clearfix">
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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