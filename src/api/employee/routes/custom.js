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
      handler: 'employee.setFace',
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
    }
  ],
};
