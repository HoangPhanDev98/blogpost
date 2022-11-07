import axiosClient from './axiosClient'

export function getAllCities(params) {
  const url = '/students'
  return axiosClient.get(url, { params })
}

export function getCityById(id) {
  const url = `/students/${id}`
  return axiosClient.get(url)
}
