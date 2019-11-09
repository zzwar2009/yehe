import UrlConfig from './host.config';
import versions from '../versions.json'

const Version = {
    versionName: UrlConfig.is_release ? versions.version : versions.build,
};

export default Version;
