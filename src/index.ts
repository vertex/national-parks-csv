import axios from 'axios'
import async, { any } from 'async'
import process from 'process'
import {createObjectCsvWriter} from 'csv-writer'
import { resolveTxt } from 'dns'

let writer = createObjectCsvWriter({
  path: 'parks.csv',
  header: [
    {
      id: 'fullName',
      title: 'name'
    },
    {
      id: 'url',
      title: 'URL'
    },
    {
      id: 'parkCode',
      title: 'parkCode'
    },
    {
      id: 'description',
      title: 'description'
    },
    {
      id: 'latitude',
      title: 'latitude'
    },
    {
      id: 'longitude',
      title: 'longitude'
    },
    {
      id: 'designation',
      title: 'designation'
    }
  ]
}) 
const apiKey = process.env.NP_API_KEY; 
let records: any[] = []
let numParks = 99;
console.log("Starting...")
async.whilst(
  function test(callback) { let ret =  records.length < numParks; console.log(`whislt cb returning: ${ret}, ${records.length} < ${numParks}` ); callback(null, ret); return ret },
  function iter(callback) {
    console.log(`requesting ${records.length} of ${numParks}`)
    axios('https://developer.nps.gov/api/v1/parks?api_key=' + apiKey + '&start=' + records.length)
      .then(response => {
        numParks = parseInt(response.data.total, 10)
        response.data.data.forEach((park:any) => { 
          records.push(park)    
        })
        callback()
      }).catch( error => {
        console.error("THERE WAS AN ERROR", error)
      })

  },
  () => {
    console.log('done with requests')
    writer.writeRecords(records)       // returns a promise
      .then(() => {
        console.log('...Done writing CSV');
      });
  }
)
// {
//   id: '81F81EBD-0FE7-4811-88EF-AB071E737D97',
//   url: 'https://www.nps.gov/bost/index.htm',
//   fullName: 'Boston National Historical Park',
//   parkCode: 'bost',
//   description: 'Discover how one city could be the Cradle of Liberty, site of the first major battle of American Revolution, and home to many who espoused that freedom can be extended to all.',
//   latitude: '42.36957407',
//   longitude: '-71.05536763',
//   latLong: 'lat:42.36957407, long:-71.05536763',
//   activities: [Array],
//   topics: [Array],
//   states: 'MA',
//   contacts: [Object],
//   entranceFees: [Array],
//   entrancePasses: [],
//   fees: [],
//   directionsInfo: 'Visitor Centers are located at Historic Faneuil Hall, 1 Faneuil Hall Sq, and the Charlestown Navy Yard, Building 5. Go to the Directions page for more detailed information.',
//   directionsUrl: 'http://www.nps.gov/bost/planyourvisit/directions.htm',
//   operatingHours: [Array],
//   addresses: [Array],
//   images: [Array],
//   weatherInfo: 'Temperatures range from warm, humid summer days to cold New England winter days. Wear comfortable sportswear in season, with comfortable walking shoes.',
//   name: 'Boston',
//   designation: 'National Historical Park'