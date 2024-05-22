import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export const getPreparedHeaders = () => {
  const urlParts =
    typeof window !== 'undefined'
      ? window.location.href.split('/').slice(4)
      : [];
  console.log(urlParts, 'url parts');
  const vertical = urlParts[0] || '';
  const project = urlParts[1] || '';
  const module_ = urlParts[2] || '';
  const token = localStorage?.getItem('token') || '';
  let username = '';
  let uniqueId = '';

  try {
    if (token) {
      const userDetails = jwtDecode(token);
      console.log(userDetails, 'detials');
      username = userDetails?.username;
    }
    uniqueId = localStorage?.getItem('uniqueId') || '';
  } catch (error) {
    toast('Failed to decode token or retrieve user details:', {
      hideProgressBar: true,
      type: 'error',
    });
  }

  return {
    vertical,
    project,
    module: module_,
    token,
    username,
    uniqueId,
  };
};

export const prepareHeaders = (headers) => {
  const { vertical, project, module, token, username, uniqueId } =
    getPreparedHeaders();

  if (module) headers.set('module', module);
  if (vertical) headers.set('vertical', vertical);
  if (project) headers.set('project', project);
  if (username) headers.set('username', username);
  if (token) headers.set('authorization', `Bearer ${token}`);
  if (uniqueId) headers.set('Unique_id', uniqueId);

  return headers;
};
