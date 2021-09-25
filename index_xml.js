const fs = require('fs');
const xml2js = require('xml2js');

let xml = fs.readFileSync('np.kml', {encoding:'utf8', flag:'r'})
strategies = [
  name => name.toLowerCase().split(' ').map(r => r.substring(0, 2)).join(''),
  name => name.toLowerCase().replace(/\s/g, '').substring(0,4),
  name

]
xml2js.parseString(xml, (err, result) =>{
  result.kml.Document[0].Folder.map((o) =>{
    return o.Placemark.map((pm) => {


      let npid = pm['name'][0]
      let npurl = 'https://www.nps.gov/' +npid+ '/index.htm'
      pm.ExtendedData[0].Data.push({ '$': { name: 'URL' }, value: [ npurl ] })
      //console.log(pm)
      console.log(pm['name'][0], pm.ExtendedData[0].Data)
      return pm
    })
  })
    
  /*var builder = new xml2js.Builder();
  var newX = builder.buildObject(xml2js);
  console.log(newX)*/
})
