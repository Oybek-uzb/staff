const fs = require("fs");
const path = require("path");
const { extension } = require('mime-types');
const { pipeline } = require("stream");
const jwt = require('jsonwebtoken');
const uploadPath = path.resolve(strapi.dirs.static.public, 'uploads');
const UPLOADS_FOLDER_NAME = 'uploads'


const formatFileInfo = async function(file) {
  let ext = path.extname(file.name);
  if (!ext) {
    ext = `.${extension(file.type)}`;
  }
  const basename = path.basename(file.name, ext);
  return {
    name: basename,
    file: file.name,
    ext,
    mime: file.type,
    size: file.size,
    stream: fs.createReadStream(file.path)
  }
}




const customError = (ctx, log, status) => {
  return ctx.send({
    success: false,
    message: log
  }, status || 400);
}


// async function parseJwt (token, ctx) {
//   try {
//     let base64Url = token.split('.')[1];
//     let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     return customError(ctx, e.message)
//   }
// }
async function parseJwt (token, ctx) {
  try {
    const _ = jwt.verify(token, strapi.config.get('plugin.users-permissions.jwtSecret'))
    return _
  } catch (e) {
    return customError(ctx, e.message)
  }
}

async function uploader (base64) {
  const base64Data = base64.replace("data:image/png;base64,", "");
  const filePath = `/icons/icon-${Date.now()}.jpg`
  const path = `${uploadPath + filePath}`
  await fs.writeFile(path, base64Data, 'base64', function(err) {
    console.log(err);
  });
  return filePath
}


async function uploadStream(file, folder) {
  const _uploadPath = path.resolve(strapi.dirs.static.public, `${UPLOADS_FOLDER_NAME + '/' + folder}`);
  const _file = await formatFileInfo(file)
  const _file_hash = `${_file.name}-${Date.now()}${_file.ext}`
  // const _fileStream = fs.createWriteStream()
  return new Promise( (resolve, reject) => {
    pipeline(
      _file.stream,
      fs.createWriteStream(path.join(_uploadPath, _file_hash)),
      async (err) => {
        if (err) return reject(err);
        // delete _file.stream

        _file.url = `/${folder}/${_file_hash}`;
        _file.full_path = path.join(_uploadPath, _file_hash);
        resolve(_file.url);
      }
    );
  });
}



module.exports = {
  customError,
  parseJwt,
  uploader,
  uploadStream
}
