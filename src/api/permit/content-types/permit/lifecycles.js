const DigestFetch = require('digest-fetch')
module.exports = {
  async afterCreate(event) {
    const {data, } = event.params
    const {id} = event.result
    console.log("WHERE", event)
    const employee = await strapi.entityService.findOne('api::employee.employee', data.employee, {
      populate: '*'
    });
    const hikvisions = await strapi.entityService.findMany('api::hikvision.hikvision');
    const qrCode = `key${Date.now()}`
    const _ = {
      CardInfo:{
        employeeNo: `emp${employee.id}`,
        cardNo: qrCode,
        cardType: "normalCard"
      }
    }
    const isEdit = false
    try {
      for await (const hik of hikvisions) {
        const client = new DigestFetch('admin', hik.password)
        const _url = `http://${hik.ip}/ISAPI/AccessControl/CardInfo/${isEdit ? 'Modify' : 'Record'}?format=json`
        const _req = await client.fetch(_url, {
          method: isEdit ? 'PUT' : 'POST',
          body: JSON.stringify(_),
          headers: {'Content-Type': 'application/json'}
        })
        // const _data = await _req.json()
        // if (_data.errorCode) return customError(ctx, _data, 400)
      }
      await strapi.entityService.update('api::permit.permit', id, { data: { qrCode: qrCode } })
      console.log('Qr Code added')
    } catch (e) {
      console.log("Error in card assign in permit", e.message)
    }
  }
}
