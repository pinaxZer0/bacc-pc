const fs=require('fs'), path=require('path'), chokidar =require('chokidar');

var chk={}, data={};
function rebuildData() {
    console.log('load manifest');
    try {
        data=JSON.parse(fs.readFileSync(path.join(__dirname, 'bin/manifest.json'), {encoding:'utf8'}));
    } catch(e) {
        data={};
    }        
    chk={};
    for (var i in data) {
        chk[data[i]]=1;
    }
}
rebuildData();
chokidar.watch(path.join(__dirname, 'bin/manifest.json')).on('change', rebuildData)

module.exports=function(req, res, next) {
    var p=req.originalUrl;
    // if (p=='/') return next();
    if (p.startsWith('/js/') || p.startsWith('/loader.js') || p.startsWith('/manifest.json') || p.startsWith('/favicon.ico')) return next();
    if (data[req.path.substr(1)] && !chk[p.substr(1)]) return res.status(404).end();
    next();
}