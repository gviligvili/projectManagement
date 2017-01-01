"use strict";
"use strict";

const NYC_KEY = 'bjp8KrRvAPtuf809u1UXnI0Z8';
const request = require('superagent-bluebird-promise');
const NYC_CENSUS_TRACTS_DS = 'https://data.cityofnewyork.us/resource/i69b-3rdj.json';
const NYC_POPULATION_DS = 'https://data.cityofnewyork.us/resource/338t-yv99.json';

module.exports = function (req,res) {
    // url for census tracts api of nyc
    let lat = '-73.979526', lon= '40.766227';

    return getCensusOfNz(lon, lat)
        .then(res => getPopulationOfCensus(res.body[0].boro_ct_2010))
        .then(res => parserCensusPopulation(res.body))
        .then(resData => {
            return res.status(200).json(resData);
        })
        .catch(err => {
            throw err;
        });
}

function getCensusOfNz(lon, lat) {
    return request.get(NYC_CENSUS_TRACTS_DS)
        .query({
            '$select': 'boro_ct_2010',
            // syntax to get if a census tract intersects with a point (lat BEFORE lon!!)
            '$where' :`intersects(the_geom, 'POINT (${lat} ${lon})')`
        })
        .set('X-App-Token', NYC_KEY) // the verification header for the api
}

function getPopulationOfCensus(fullCensusTract) {
    let dcp_borough_code = fullCensusTract[0]
    let census_tract = fullCensusTract.slice(1);

    return request.get(NYC_POPULATION_DS)
        .query({
            census_tract,
            dcp_borough_code
        })
        .set('X-App-Token', NYC_KEY) // the verification header for the api
}
    
function parserCensusPopulation(populationsByYear) {
    let nearestPopulation;

    for (let pop of populationsByYear) {
        if (!nearestPopulation || parseInt(nearestPopulation.year) < parseInt(pop.year)) {
            nearestPopulation = pop;
        }
    }

    return nearestPopulation || {};
}