'use strict';

const {customError} = require("../../../utils");
const moment = require("moment");
/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


const groupBy = function (array) {

}
// module.exports = createCoreController('api::event.event');
module.exports = createCoreController('api::event.event', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::event.event').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::event.event').findOne(id, _query)
      return res
    },
    async attendances (ctx) {
      const _query = { ...ctx.query }
      const { date, employee } = _query
      const _emp = `and e.id = ${employee}`
      if (!date) return customError(ctx, 'date query must be required')
      const query = (val) => {
        return `select events.time as time, events.minor, events.major, to_json(e) as employee, to_json(h) as hikvision, date(events.time) date from events
        left join events_employee_links eel on events.id = eel.event_id
         inner join employees e on eel.employee_id = e.id
         left join employees_hikvisions_links ehl on e.id = ehl.employee_id
         left join hikvisions h on ehl.hikvision_id = h.id
         where events.current_verify_mode = 'cardOrFace' and major = 5 and (minor = 1 or minor = 75) and date(events.time) = '${date}' ${ employee ? _emp : '' }
         order by e.id, time asc;`
      }
      console.log(query())
      const { rows } = await strapi.db.connection.raw(query())
      // return rows
      const _a = await rows.reduce((events, event) => {
        if (!events[event['employee']['id']]) {
          events[event['employee']['id']] = [];
        }
        event.time = moment(event.time).format('YYYY-MM-DD HH:mm:ss')
        events[event['employee']['id']].push(event);
        return events;
      }, {})
      return Object.entries(_a).map(e => {
        return {
          employee: e[1][0].employee,
          events: e[1].map(el => {
            delete el.employee
            return el
          })
        }
      })
      // return _a.map(([k, v]) => {
      //   return {
      //     employee: k, events: v
      //   }
      // })
      // let b = []
      // for await (const [key, entry] of _a) {
      //   b.push({ employee: key, events: entry })
      // }
      // return b
      // return Array.from(_a, function (entry) {
      //   return { employee: entry[0], events: entry[1] };
      // });
      // const map = new Map()
      // for await (const [index, element] of rows.entries()) {
      //   map.set(element.date, element)
      //   console.log(index, element);
      // }
      // return map
    }
  }
))
