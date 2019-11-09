import React from 'react';
import { Upload, Icon, message } from 'antd';
import style from './UploadFilesModel.less';
import UrlConfig from '../../../config/host.config';

class ImgUpload extends React.Component {
    state = {
        loading: false,
        imgUrl: undefined,
    };

    componentDidMount() {}

    handleChange = info => {
        if (info.file.status === 'error') {
            this.setState({
                loading: false,
            });
            message.error(info.file.error.message);
        }

        if (info.file.status === 'uploading') {
            this.setState({
                loading: true,
            });
            return;
        }

        if (info.file.status === 'done') {
            const { imgCallback } = this.props;
            this.setState(
                {
                    loading: false,
                    imgUrl: info.file.response,
                },
                () => {
                    const { imgUrl } = this.state;
                    imgCallback(imgUrl);
                }
            );
        }
    };

    render() {
        const { loading, imgUrl } = this.state;
        const { name } = this.props;

        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传</div>
            </div>
        );

        return (
            <div style={{ width: '103px', height: '103px', margin: '0px', padding: '0px' }}>
                <div>{name}</div>
                <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={UrlConfig.upload_files_url}
                    onChange={this.handleChange}
                >
                    {imgUrl ? (
                        <img src={imgUrl} alt="avatar" className={style.imgStyle} />
                    ) : (
                        uploadButton
                    )}
                </Upload>
            </div>
        );
    }
}

export default ImgUpload;
