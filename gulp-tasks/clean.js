const del = require("del");
const paths = require("./paths");
 
module.exports = function cleanAssets() {
    // clean the assets folder
    return del([paths.assets]);
}