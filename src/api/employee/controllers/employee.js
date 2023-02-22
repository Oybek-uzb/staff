'use strict';

/**
 * employee controller
 */

const {createCoreController} = require('@strapi/strapi').factories;
const DigestFetch = require('digest-fetch')
const fs = require('fs')
const moment = require('moment')
// const AxiosDigestAuth = require('@mhoc/axios-digest-auth').default
// const fetch = require('node-fetch')
// const { FormData } = fetch
const FormData = require('form-data');
// const axios = require('axios');


const utils = require('../../../utils')
const {customError, uploadStream} = utils


module.exports = createCoreController('api::employee.employee', ({strapi}) => ({
  async find(ctx) {
    const _query = {...ctx.query}
    const {results, pagination} = await strapi.service('api::employee.employee').find(_query);
    return {results, pagination};
  },
  async findOne(ctx) {
    const _query = {...ctx.query}
    const _params = {...ctx.params}
    const {id} = _params
    const res = await strapi.service('api::employee.employee').findOne(id, _query)
    return res
  },
  async addHikVisionEmployee(ctx) {
    const body = {...ctx.request.body}
    const isEdit = ctx.request.url.search('edit') > -1

    const {hikvisionId, employeeId, beginTime, endTime} = body

    if (!hikvisionId) return customError(ctx, 'hikvisionId is required')
    if (!employeeId) return customError(ctx, 'employeeId is required')

    const hikvision = await strapi.entityService.findOne('api::hikvision.hikvision', hikvisionId);
    const employee = await strapi.entityService.findOne('api::employee.employee', employeeId);
    if (!hikvision) return customError(ctx, 'hikvision is not found')
    if (!employee) return customError(ctx, 'employee is not found')

    const {id, firstName, lastName} = employee
    const _ = {
      UserInfo: {
        employeeNo: `emp${id}`,
        name: `${firstName} ${lastName ? lastName : ''}`,
        userType: "normal",
        Valid: {
          enable: true,
          beginTime: beginTime ? new Date(moment(beginTime).add(5, 'hours')).toISOString().slice(0, -5) : "2023-01-01T00:00:00",
          endTime: endTime ? new Date(moment(endTime).add(5, 'hours')).toISOString().slice(0, -5) : "2024-01-01T00:00:00"
        }
      }
    }
    console.log(_)
    try {
      const client = new DigestFetch('admin', hikvision.password)
      const _url = `http://${hikvision.ip}/ISAPI/AccessControl/UserInfo/${isEdit ? 'Modify' : 'Record'}?format=json`
      console.log(_url)
      const _req = await client.fetch(_url, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(_),
        headers: {'Content-Type': 'application/json'}
      })
      const _data = await _req.json()
      if (_data.errorCode) return customError(ctx, _data, 400)
      await strapi.entityService.update('api::employee.employee', id, { data: { hikvision: hikvision.id } })
      return _data

    } catch (e) {
      return customError(ctx, e, 500)
    }
  },
  async removeHikVisionEmployee(ctx) {
    const params = {...ctx.request.params}

    const { id } = params

    const employee = await strapi.entityService.findOne('api::employee.employee', id, {
      populate: '*'
    });
    if (!employee) return customError(ctx, 'employee is not found')

    if (!employee.hikvision) return customError(ctx, 'employee is not hikvision user')

    const _ = {
      UserInfoDelCond: {
        EmployeeNoList: [
          {
            employeeNo: `emp${id}`
          }
        ]
      }
    }

    try {
      const client = new DigestFetch('admin', employee.hikvision.password)
      const _url = `${employee.hikvision.ip}/ISAPI/AccessControl/UserInfo/Delete?format=json`
      const _req = await client.fetch(_url, {
        method: 'PUT',
        body: JSON.stringify(_),
        headers: {'Content-Type': 'application/json'}
      })
      const _data = await _req.json()
      if (_data.errorCode) return customError(ctx, _data, 400)
      await strapi.entityService.update('api::employee.employee', id, { data: { hikvision: null } })
      return _data
    } catch (e) {
      return customError(ctx, e, 500)
    }
  },
  async getEventHikVisionEmployeeLogs(ctx) {
    const _query = {...ctx.query}

    const { employee, offset, limit, start_date, end_date } = _query
    if (!employee) return customError(ctx, 'employee is not found')
    const _employee = await strapi.entityService.findOne('api::employee.employee', employee, {
      populate: '*'
    });

    if (!_employee) return customError(ctx, 'employee is not found')

    if (!_employee.hikvision) return customError(ctx, 'employee is not hikvision user')

    const _ = {
      AcsEventCond: {
        "searchID": Date.now().toString(),
        "searchResultPosition": parseInt(offset) || 0,
        "major": 0,
        "minor": 0,
        "startTime": `${start_date || '2022-01-01'}T00:00:00+08:00`,
        "endTime":`${end_date || '2030-12-31'}T23:59:59+08:00`,
        "maxResults": parseInt(limit) || 100,
        "employeeNoString": `emp${employee}`
      }
    }

    try {
      const client = new DigestFetch('admin', _employee.hikvision.password)
      const _url = `http://${_employee.hikvision.ip}/ISAPI/AccessControl/AcsEvent?format=json`
      const _req = await client.fetch(_url, {
        method: 'POST',
        body: JSON.stringify(_),
        headers: {'Content-Type': 'application/json'}
      })
      const _data = await _req.json()
      if (_data.errorCode) return customError(ctx, _data, 400)
      const _InfoList = _data['AcsEvent']['InfoList']
      // for await (const emp of _InfoList) {
      //   const _employee = await strapi.entityService.findOne('api::employee.employee',emp , {
      //     populate: '*'
      //   });
      // }
      return { data: _InfoList }
    } catch (e) {
      return customError(ctx, e, 500)
    }
  },
  async setFace (ctx) {

    if (!ctx.request.files) return customError(ctx, `File is required`)
    //
    const { file } = ctx.request.files;
    const { id } = ctx.request.params

    if (!file) return customError(ctx, `file is required in form-data`)
    const fileIsArray = Array.isArray(file)
    if(fileIsArray) return customError(ctx, `Multiple files are not supported. Send one file`)


    const employee = await strapi.entityService.findOne('api::employee.employee', id, {
      populate: '*'
    });
    if (!employee) return customError(ctx, 'employee is not found')

    if (!employee.hikvision) return customError(ctx, 'employee is not hikvision user')

    const _face = await uploadStream(file, 'faces')

    const data = new FormData()

    data.append('FaceDataRecord', `{"faceLibType":"blackFD","FDID":"1","FPID":emp${id} }`)
    data.append('img', fs.createReadStream(_face.full_path))

    // const _ = new AxiosDigestAuth({
    //   username: "admin",
    //   password: "datagaze@#$"
    // });

    // const _res = await _.request({
    //   method: "GET",
    //   url: "http://192.168.0.128/ISAPI/AccessControl/CardInfo/capabilities?format=json"
    // })
    // const _res = axios.get('http://192.168.0.128/ISAPI/AccessControl/CardInfo/capabilities?format=json', {
    //   auth: {
    //     username: 'admin',
    //     password: 'datagaze@#$'
    //   }
    // })
    // return _res
    // console.log(data.getBoundary())
    // _.append('FaceDataRecord', JSON.stringify({
    //   faceLibType: "blackFD",
    //   FDID: "1",
    //   FPID: `emp${id}`
    // }));
    // _.append('FaceImage', _face.stream);
    try {
      const client = new DigestFetch('admin', employee.hikvision.password)

      const _url = `${employee.hikvision.ip}/ISAPI/Intelligent/FDLib/FDSetUp?format=json`
      const _req = await client.fetch(_url, {
        method: 'PUT',
        body: data,
        headers: {'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`}
      })
      const _data = await _req.json()
      if (_data.errorCode) return customError(ctx, _data, 400)
      return _data
    } catch (e) {
      return customError(ctx, e, 500)
    }
  }
}));
