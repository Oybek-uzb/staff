module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/hikvision/user/create',
      handler: 'employee.addHikVisionEmployee',
      config: {}
    },
    {
      method: 'PUT',
      path: '/hikvision/user/edit',
      handler: 'employee.addHikVisionEmployee',
      config: {}
    },
    {
      method: 'DELETE',
      path: '/hikvision/user/delete/:id',
      handler: 'employee.removeHikVisionEmployee',
      config: {}
    },
    {
      method: 'POST',
      path: '/hikvision/user/face/:id',
      handler: 'employee.setFace2',
      config: {}
    },
    {
      method: 'GET',
      path: '/hikvision/event/logs',
      handler: 'employee.getEventHikVisionEmployeeLogs',
      config: {}
    },
    {
      method: 'POST',
      path: '/employee/face/upload',
      handler: 'employee.faceUpload',
      config: {}
    },
    {
      method: 'POST',
      path: '/employee/card/assign',
      handler: 'employee.cardAssign',
      config: {}
    },
    {
      method: 'GET',
      path: '/dashboards/home/stats',
      handler: 'employee.dashboardStats',
      config: {}
    },
  ],
};
