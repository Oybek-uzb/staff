'use strict';

/**
 * employee controller
 */

const {createCoreController} = require('@strapi/strapi').factories;
const DigestFetch = require('digest-fetch')
const fs = require('fs')
const moment = require('moment')
const FormData = require('form-data');
const digestUpload = require('../../../utils/digestFormUpload').digestAuthRequest


const utils = require('../../../utils')
const path = require("path");
const {customError, uploadStream} = utils

function stream2buffer(stream) {

  return new Promise((resolve, reject) => {

    const _buf = [];

    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));

  });
}


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

    const {employeeId, beginTime, endTime} = body

    // if (!hikvisions) return customError(ctx, 'hikvisions is required')
    if (!employeeId) return customError(ctx, 'employeeId is required')

    const hikvisions = await strapi.entityService.findMany('api::hikvision.hikvision');
    const employee = await strapi.entityService.findOne('api::employee.employee', employeeId);
    // if (!hikvision) return customError(ctx, 'hikvision is not found')
    if (!employee) return customError(ctx, 'employee is not found')

    const currentYear = new Date().getFullYear()

    const {id, firstName, lastName} = employee
    const _ = {
      UserInfo: {
        employeeNo: `emp${id}`,
        name: `${firstName} ${lastName ? lastName : ''}`,
        userType: "normal",
        Valid: {
          enable: true,
          beginTime: beginTime ? new Date(moment(beginTime).add(5, 'hours')).toISOString().slice(0, -5) : `${currentYear}-01-01T00:00:00`,
          endTime: endTime ? new Date(moment(endTime).add(5, 'hours')).toISOString().slice(0, -5) : `${currentYear+10}-01-01T00:00:00`
        },
        RightPlan: [
          {doorNo: 1, planTemplateNo: "1"}
        ],
        doorRight: '1'
      }
    }
    console.log(_)
    try {

      for await (const hik of hikvisions) {
        const client = new DigestFetch('admin', hik.password)
        const _url = `http://${hik.ip}/ISAPI/AccessControl/UserInfo/${isEdit ? 'Modify' : 'Record'}?format=json`
        console.log(_url)
        const _req = await client.fetch(_url, {
          method: isEdit ? 'PUT' : 'POST',
          body: JSON.stringify(_),
          headers: {'Content-Type': 'application/json'}
        })
        const _data = await _req.json()
        if (_data.errorCode) return customError(ctx, _data, 400)
      }
      await strapi.entityService.update('api::employee.employee', id, {data: {hikvisions: hikvisions.map(e => e.id)}})
      return 'success'
    } catch (e) {
      return customError(ctx, e, 500)
    }
  },
  async removeHikVisionEmployee(ctx) {
    const params = {...ctx.request.params}

    const {id} = params

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
      const _url = `http://${employee.hikvision.ip}/ISAPI/AccessControl/UserInfo/Delete?format=json`
      const _req = await client.fetch(_url, {
        method: 'PUT',
        body: JSON.stringify(_),
        headers: {'Content-Type': 'application/json'}
      })
      const _data = await _req.json()
      if (_data.errorCode) return customError(ctx, _data, 400)
      await strapi.entityService.update('api::employee.employee', id, {data: {hikvision: null}})
      return _data
    } catch (e) {
      return customError(ctx, e, 500)
    }
  },
  async getEventHikVisionEmployeeLogs(ctx) {
    const _query = {...ctx.query}

    const {employee, offset, limit, start_date, end_date} = _query
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
        "endTime": `${end_date || '2030-12-31'}T23:59:59+08:00`,
        "maxResults": parseInt(limit) || 100,
        "employeeNoString": `emp${employee}`
      }
    }
    console.log(_)

    try {
      const client = new DigestFetch('admin', _employee.hikvision.password)
      const _url = `http://${_employee.hikvision.ip}/ISAPI/AccessControl/AcsEvent?format=json`
      console.log(_url)
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
      return {data: _InfoList}
    } catch (e) {
      return customError(ctx, e, 500)
    }
  },
  async setFace(ctx) {

    if (!ctx.request.files) return customError(ctx, `File is required`)
    //
    const {file} = ctx.request.files;
    const {id} = ctx.request.params

    if (!file) return customError(ctx, `file is required in form-data`)
    const fileIsArray = Array.isArray(file)
    if (fileIsArray) return customError(ctx, `Multiple files are not supported. Send one file`)


    // const employee = await strapi.entityService.findOne('api::employee.employee', id, {
    //   populate: '*'
    // });
    // if (!employee) return customError(ctx, 'employee is not found')

    // if (!employee.hikvision) return customError(ctx, 'employee is not hikvision user')

    const _face = await uploadStream(file, 'faces')

    const data = new FormData()

    data.append('FaceDataRecord', `{"faceLibType":"blackFD","FDID":"1","FPID": "emp9" }`)
    // data.append('FaceImage', fs.createReadStream(_face.full_path), {contentType: 'image/jpeg'} )

    const buf = await stream2buffer(fs.createReadStream(_face.full_path))
    console.log('BUF', buf)
    // .then((buf) => {
    data.append('FaceImage', buf, {contentType: 'image/jpeg'});

    // getRequest.request(console.log, err => {
    //   console.log(err)
    // }, form)
    // })
    // try {
    const client = new DigestFetch('admin', 'datagaze@#$')

    const _url = `http://192.168.100.68/ISAPI/Intelligent/FDLib/FDSetUp?format=json`
    const _req = await client.fetch(_url, {
      method: 'put',
      body: data
    })
    const _data = await _req.json()
    if (_data.errorCode) return customError(ctx, _data, 400)
    return _data
    // } catch (e) {
    //   return customError(ctx, e, 500)
    // }
  },
  async setFace2(ctx) {
    const {image} = {...ctx.request.body};
    const {id} = ctx.request.params

    if (!image) return customError(ctx, `image is require`)

    const hikvisions = await strapi.entityService.findMany('api::hikvision.hikvision');
    const employee = await strapi.entityService.findOne('api::employee.employee', id);
    if (!employee) return customError(ctx, 'employee is not found')
    const _uploadPath = path.resolve(strapi.dirs.static.public, `${'uploads'}`);
    const _image_path = path.join(_uploadPath, image)
    const buf = await stream2buffer(fs.createReadStream(_image_path))
    const form = new FormData()
    form.append('FaceDatasRecord', JSON.stringify({"faceLibType": "blackFD", "FDID": "1", "FPID": `emp${id}`}));
    form.append('FaceImage', buf, {contentType: 'image/jpeg'});
    try {
      let uploaded = []
      for await (const hik of hikvisions) {
        console.log('HIKI', hik)
        const url = `http://${hik.ip}/ISAPI/Intelligent/FDLib/FDSetUp?format=json`
        console.log('URLS: ', url)
        const getRequest = new digestUpload('PUT', url, 'admin', 'datagaze@#$')
        const _a = await getRequest.request(succ => {
          console.log('Success', succ)
        }, err => {
          console.log('error', err)
        }, form)
        uploaded.push({
          hikvision: hik.ip,
          data: _a
        })
      }
      return uploaded
    } catch (e) {
      return customError(ctx, e.text, 400)
    }
  },
  async faceUpload(ctx) {
    try {
      const {face} = ctx.request.files;
      if (!face) return customError(ctx, `face is required in form-data`)
      const fileIsArray = Array.isArray(face)
      if (fileIsArray) return customError(ctx, `Multiple files are not supported. Send one file`)
      if (!face.size && !face.name) return customError(ctx, `face is empty`)
      const _face = await uploadStream(face, 'faces')
      delete _face.stream
      return _face
    } catch (e) {
      return customError(ctx, e.message, 400)
    }
  },
  async cardAssign(ctx) {
    const body = {...ctx.request.body}

    const {employeeId, cardNo} = body
    if (!employeeId) return customError(ctx, 'employeeId is required')
    if (!cardNo) return customError(ctx, 'cardNo is required')

    const hikvisions = await strapi.entityService.findMany('api::hikvision.hikvision');
    const employee = await strapi.entityService.findOne('api::employee.employee', employeeId);
    if (!employee) return customError(ctx, 'employee is not found')

    const _ = {
      CardInfo: {
        employeeNo: `emp${employeeId}`,
        cardNo: cardNo,
        cardType: "normalCard"
      }
    }
    try {
      const isEdit = false
      for await (const hik of hikvisions) {
        const client = new DigestFetch('admin', hik.password)
        const _url = `http://${hik.ip}/ISAPI/AccessControl/CardInfo/${isEdit ? 'Modify' : 'Record'}?format=json`
        const _req = await client.fetch(_url, {
          method: isEdit ? 'PUT' : 'POST',
          body: JSON.stringify(_),
          headers: {'Content-Type': 'application/json'}
        })
        const _data = await _req.json()
        if (_data.errorCode) return customError(ctx, _data, 400)
      }
      return 'success'
    } catch (e) {
      return customError(ctx, e, 500)
    }
  },
  async dashboardStats (ctx) {
    try {
      const employees = await strapi.db.query('api::employee.employee').count()
      const computers = await strapi.db.query('api::computer.computer').count()
      const incidents = await strapi.db.query('api::incident.incident').count()
      return {
        employees,
        computers,
        incidents
      }
    } catch (e) {
      return customError(ctx, e.message, 400)
    }
  }
}));
