import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    const url = '/posts/';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/posts/';
    return axiosClient.add(url, data);
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },

  delete(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
