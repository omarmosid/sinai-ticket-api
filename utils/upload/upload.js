const s3 = require("../../config/aws");

const fileUpload = (filename) => {
  console.log('preparing to upload...');
  fs.readFile(source, function (err, filedata) {
    if (!err) {
      const putParams = {
          Bucket      : 'omars-sandbox',
          Key         : targetName,
          Body        : filedata
      };
      s3.putObject(putParams, function(err, data){
        if (err) {
          console.log('Could nor upload the file. Error :',err);
          return res.send({success:false});
        } 
        else{
          fs.unlink(source);// Deleting the file from uploads folder(Optional).Do Whatever you prefer.
          console.log('Successfully uploaded the file');
          return res.send({success:true});
        }
      });
    }
    else{
      console.log({'err':err});
    }
  });
}