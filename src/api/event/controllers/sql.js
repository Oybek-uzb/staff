module.exports = {
  sql: (date, company) => {
    return `select e.id, e.first_name
from employees e
         left join events_employee_links eel on e.id = eel.employee_id
         left join events on eel.event_id = events.id
where events.created_at between '${date} 00:00:00' and '${date} 23:59:59'

order by events.time asc;



select *
from hikvisions h
         left join events_hikvision_links ehl on h.id = ehl.hikvision_id
         left join events e on ehl.event_id = e.id;

with in_events as (select events.*
                   from events
                            left join events_hikvision_links ehl on events.id = ehl.event_id
                            left join hikvisions h on ehl.hikvision_id = h.id
                   where h.type = 'in'
                     and events.created_at between '${date} 00:00:00' and '${date} 23:59:59'),
     out_events as (select events.*
                    from events
                             left join events_hikvision_links ehl on events.id = ehl.event_id
                             left join hikvisions h on ehl.hikvision_id = h.id
                        and events.created_at between '${date} 00:00:00' and '${date} 23:59:59'
                    where h.type = 'out'),
     unn_envents as (select *
                     from (select e.time::time, 1 as type_index, 'in' as type, e.id
                           from in_events e
                           union
                           select e.time::time, 2 as type_index, 'out' as type, e.id
                           from out_events e) as x
                     where x.time is not null
                     order by type_index, time)
select e.id,
       e.first_name,
       count(ein.id)                                                    as input_count,
       count(eout.id)                                                   as output_count,
       min(ein.time)::time                                              as first_input,
       max(eout.time)::time                                             as last_output,
       case
           when count(ein.id) = 0 then 'kemadi'
           when min(ein.time)::time > (select work_start_time from companies where id = ${company}) then 'kechikdi'
           else 'keldi'
           end                                                          as status,
       json_agg(jsonb_build_object('time', unn.time, 'type', unn.type)) as events
from employees e
         left join events_employee_links eel on e.id = eel.employee_id
         left join in_events ein on ein.id = eel.event_id
         left join out_events eout on eout.id = eel.event_id
         left join unn_envents unn on unn.id = eel.event_id
where unn.time is not null
group by e.id
;`
  },
  sql2: (date, company, employee) => {
    const _emp = `and e.id = ${employee}`
    return `with in_events as (select events.*
                   from events
                            left join events_hikvision_links ehl on events.id = ehl.event_id
                            left join hikvisions h on ehl.hikvision_id = h.id
                   where h.type = 'in'
                     and events.created_at between '${date} 00:00:00' and '${date} 23:59:59'),
     out_events as (select events.*
                    from events
                             left join events_hikvision_links ehl on events.id = ehl.event_id
                             left join hikvisions h on ehl.hikvision_id = h.id
                        and events.created_at between '${date} 00:00:00' and '${date} 23:59:59'
                    where h.type = 'out'),
     unn_envents as (select *
                     from (select e.time::time, 1 as type_index, 'in' as type, e.id
                           from in_events e
                           union
                           select e.time::time, 2 as type_index, 'out' as type, e.id
                           from out_events e) as x
                     where x.time is not null
                     order by type_index, time)
select e.id,
       e.first_name,
       e.last_name,
       count(ein.id)                                                    as input_count,
       count(eout.id)                                                   as output_count,
       min(ein.time)::time                                              as first_input,
       max(eout.time)::time                                             as last_output,
       case
           when count(ein.id) = 0 then 'not_came'
           when min(ein.time)::time > (select work_start_time from companies where id = ${company}) then 'late'
           else 'came'
           end                                                          as status,
       json_agg(jsonb_build_object('time', unn.time, 'type', unn.type)) as events
from employees e
         left join events_employee_links eel on e.id = eel.employee_id
         left join in_events ein on ein.id = eel.event_id
         left join out_events eout on eout.id = eel.event_id
         left join unn_envents unn on unn.id = eel.event_id
where unn.time is not null ${ employee ? _emp : '' }
group by e.id
;
`
  }
}
