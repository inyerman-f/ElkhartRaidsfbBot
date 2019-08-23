const fs = require('fs');

function write_to_log(data) {

    fs.appendFile('./test.txt', data, function (err) {
        if (err) throw err;
        console.log(data+'Saved');
    });
}

module.exports.write_to_log = function (data) {
    write_to_log(data);
};