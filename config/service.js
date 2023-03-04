const DigestFetch = require('digest-fetch')
const md5 = require('md5')
module.exports = {
  async backUpEvents (logs) {
    try {
      let a = 0
      for await (const log of logs) {
        const _hash = md5(log.serialNo + log.time + log.mask + log.currentVerifyMode + log.major + log.minor + log.name + `hikvision_${log.hikvision}`)
        // const empl = log.employeeNoString ? ((log.employeeNoString.search('emp') > -1) ? log.employeeNoString.slice(3) : log.employeeNoString)  : null
        // console.log('EMP -> ',empl)
        const _a = {
          employee: log.employeeNoString ? ((log.employeeNoString.search('emp') > -1) ? log.employeeNoString.slice(3) : log.employeeNoString)  : null,
          name: log.name,
          time: log.time,
          currentVerifyMode: log.currentVerifyMode,
          mask: log.mask,
          hikvision: log.hikvision,
          // pictureURL: "string",
          major: log.major,
          minor: log.minor,
          hash: _hash
        }
        try {
          await strapi.entityService.create('api::event.event', {
            data: _a,
          });
          a++
        } catch (e) {
          // console.log('Unique error')
        }
      }
      console.log('BackUP:', a)
    } catch (e) {
      console.log('All Insert Error', e)
    }
  },
  async getEventsHikVision (hikvision) {
    const _size = 30
    try {
      const _ = {
        AcsEventCond: {
          "searchID": Date.now().toString(),
          "searchResultPosition": parseInt(hikvision['backUpPage']) ? (parseInt(hikvision['backUpPage']) - 1) * _size : 0,
          "major": 0,
          "minor": 0,
          "timeReverseOrder": true,
          "maxResults": _size
        }
      }
      const client = new DigestFetch('admin', hikvision.password)
      const _url = `http://${hikvision.ip}/ISAPI/AccessControl/AcsEvent?format=json`
      const _req = await client.fetch(_url, {
        method: 'POST',
        body: JSON.stringify(_),
        headers: {'Content-Type': 'application/json'}
      })
      const _res = await _req.json()
      const _total = _res['AcsEvent']['totalMatches']
      const _list = _res['AcsEvent']['InfoList']
      const _totalPage = Math.ceil(_total / _size)
      const _totalBackUpPage = Math.ceil((parseInt(hikvision['backUpCount']) + _size) / _size)
      // console.log(_totalBackUpPage, _totalPage)
      const _page = _totalBackUpPage > _totalPage ?  0 : (_totalPage - _totalBackUpPage)
      const _backUp = _total - _page * _size

      if (_list && _list.length) {
        const __ = _list.map(e => { return { ...e, hikvision: hikvision.id } })
        await module.exports.backUpEvents(__)
      }
      const _hik = await strapi.entityService.update('api::hikvision.hikvision', hikvision.id, {
        data: {
          backUpCount: _backUp,
          backUpPage: _page
        }
      });
      if (_page > 0) await module.exports.getEventsHikVision(_hik)
    } catch (e) {
      console.log('Back UP get with Terminal Error: ', e)
    }
  }
}
