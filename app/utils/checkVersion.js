import axios from 'axios';
import Package from '../package.json';

export default async () => {
  const actualVersion = await axios.get('https://drxri7dj6k.execute-api.us-east-1.amazonaws.com/prd');
  return {
    isUpdated: Package.version === actualVersion.data,
    actual: Package.version,
    next: actualVersion.data
  };
};
