"use strict"
const express = require('express');
const request = require('superagent-bluebird-promise');
const Promise = require('bluebird');

let router = express.Router();

/* GET home page. */

// router.get('/', function(req, res) {
// 	res.send({ title: 'Express' });
// });

let irrelevantTypes = [];
let _amountOfRelevantPlaces = 0;
let i = 0;

request.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
	.query({
		key: "**********",
		radius: '30',
		location: '32.070290, 34.782666',
		rankby: 'prominence'
	})
	.then(extractRelevantPlacesFromResponse)
	.then(() => {
		console.log(_amountOfRelevantPlaces);
	})

	function extractRelevantPlacesFromResponse(res) {
		_amountOfRelevantPlaces += res.body.results.filter(filterRelevantPlaces).length;

		if (res.body.next_page_token)
			return loopRequest(res.body.next_page_token);
		else
			return Promise.resolve();
	}

	function filterRelevantPlaces(place) {
		return place.types.filter(type => !irrelevantTypes.includes(type)).length
	}

	function loopRequest(pagetoken) {
		return new Promise((res, rej) => {
			setTimeout(res, 2000);
		})
		.then(() => {
			return request.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
			.query({
				pagetoken,
				key: 'AIzaSyBwnGWcCBAdMtM2h69aHpgiSKAD0S8PI8g',
				radius: '30',
				location: '32.070290, 34.782666',
				rankby: 'prominence'
			})
		})
		.then((res) => {
			return extractRelevantPlacesFromResponse(res);
		})
	};

module.exports = router;
