const axios = require('axios');
const qs = require('qs');

const baseUrl = 'https://www.polaraccesslink.com/';

const tokenAuthenticationHeaders = (accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
  return {headers: headers};
};

const basicAuthenticationHeaders = () => {
  const credentials = `${process.env.CLIENTID}:${process.env.CLIENTSECRET}`;
  const encoded = Buffer.from(credentials).toString('base64');
  const headers = {
    'Authorization': `Basic ${encoded}`,
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'Accept': 'application/json',
  };
  return {headers: headers};
};

const getEncodedCredentials = () => {
  const credentials = `${process.env.CLIENTID}:${process.env.CLIENTSECRET}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');
  return encodedCredentials;
};

const getUserAccessToken = (authorizationCode) => {
  const tokenUrl = 'https://polarremote.com/v2/oauth2/token';
  const data = {
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: process.env.REDIRECT,
  };
  const config = basicAuthenticationHeaders();
  const request = axios.post(tokenUrl, qs.stringify(data), config);
  return request.then((response) => response.data);
};

const createUser = (userId, accessToken) => {
  const data = `<?xml version="1.0" encoding="UTF-8" ?>
  <register>
    <member-id>${userId}</member-id>
  </register>`;
  const headers = {
    'Content-Type': 'application/xml',
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
  const request = axios.post(baseUrl+'v3/users', data, {headers: headers});
  return request.then((response) => response.data);
};

const getUserInfo = (accessToken, userId) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };
  const url = baseUrl+`v3/users/${userId}`;
  const request = axios.get(url, {headers: headers});
  return request.then((response) => response.data);
};

const deleteUser = (accessToken, userId) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };
  axios.delete(baseUrl+`v3/users/${userId}`, {headers: headers});
};

const createWebhook = () => {
  const data = {
    'events': [
      'EXERCISE',
    ],
    'url': process.env.WEBHOOK_URL,
  };
  const basicAuth = getEncodedCredentials();
  const config = {
    headers: {
      'Authorization': `Basic ${basicAuth}`,
    },
  };
  const request = axios.post(baseUrl+'v3/webhooks', data, config);
  return request.then((response) => response.data);
};

const deleteWebhook = (webhookId) => {
  const basicAuth = getEncodedCredentials();
  const config = {
    headers: {
      'Authorization': `Basic ${basicAuth}`,
    },
  };
  const request = axios.delete(baseUrl+`v3/webhooks/${webhookId}`, config);
  return request.then((response) => response.data);
};

const getExercise = (exerciseId, accessToken) => {
  const config = tokenAuthenticationHeaders(accessToken);
  const request = axios.get(baseUrl+`v3/exercises/${exerciseId}`, config);
  return request.then((response) => response.data);
};

const createTransaction = (userId, accessToken) => {
  const config = tokenAuthenticationHeaders(accessToken);
  const url = baseUrl+`v3/users/${userId}/exercise-transactions`;
  const request = axios.post(url, null, config);
  return request.then((response) => response);
};

const commitTransaction = (userId, transactionId, accessToken) => {
  const config = tokenAuthenticationHeaders(accessToken);
  const end = `v3/users/${userId}/exercise-transactions/${transactionId}`;
  const request = axios.put(baseUrl+end, null, config);
  return request.then((response) => response);
};

const getSamples = (userId, transactionId, exerciseId, sampleType, accessToken) => {
  const config = tokenAuthenticationHeaders(accessToken);
  const start = `v3/users/${userId}/exercise-transactions/${transactionId}`;
  const end = `/exercises/${exerciseId}/samples/${sampleType}`;
  console.log(baseUrl+start+end);
  const request = axios.get(baseUrl+start+end, config);
  return request.then((response) => response.data);
};

const getGpx = (userId, transactionId, exerciseId, accessToken) => {
  const config = {
    headers: {
      'Accept': 'application/gpx+xml',
      'Authorization': `Bearer ${accessToken}`,
    },
  };
  const start = `v3/users/${userId}/exercise-transactions/${transactionId}`;
  const end = `/exercises/${exerciseId}/gpx`;
  const request = axios.get(baseUrl+start+end, config);
  return request.then((response) => response.data);
};

module.exports = {
  getUserAccessToken,
  createUser,
  getUserInfo,
  deleteUser,
  createWebhook,
  deleteWebhook,
  getExercise,
  createTransaction,
  commitTransaction,
  getSamples,
  getGpx,
};
