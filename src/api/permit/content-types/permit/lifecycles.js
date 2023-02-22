const DigestFetch = require('digest-fetch')


module.exports = {
  async afterCreate(event) {
    const {data, } = event.params
    const {id} = event.result
    console.log("WHERE", event)
    const employee = await strapi.entityService.findOne('api::employee.employee', data.employee, {
      populate: '*'
    });

    const hikvision = employee.hikvision
    const qrCode = `key${Date.now()}`
    // const _ = {
    //   UserInfo: {
    //     employeeNo: `emp${id}`,
    //     name: `${firstName} ${lastName || ''}`,
    //     userType: "normal",
    //     Valid: {
    //       enable: true,
    //       beginTime: startDate ? new Date(startDate).toISOString().slice(0, -5) : "2023-01-01T00:00:00",
    //       endTime: expiredDate ? new Date(expiredDate).toISOString().slice(0, -5) : "2024-01-01T00:00:00"
    //     }
    //   }
    // }
    const _ = {
      CardInfo:{
        employeeNo: `emp${employee.id}`,
        cardNo: qrCode,
        cardType: "normalCard"
      }
    }
    const isEdit = false
    const client = new DigestFetch('admin', hikvision.password)
    const _url = `http://${hikvision.ip}/ISAPI/AccessControl/CardInfo/${isEdit ? 'Modify' : 'Record'}?format=json`
    const _req = await client.fetch(_url, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(_),
      headers: {'Content-Type': 'application/json'}
    })
    await strapi.entityService.update('api::permit.permit', id, { data: { qrCode: qrCode } })
    const _data = await _req.json()
    console.log('Success', _data)

  },
}
