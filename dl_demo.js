// MIT License

// Copyright (c) 2018 Alexandre Storelli

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict";

const { log } = require("abr-log")("dldemo");
const Dl = require("./dl.js").StreamDl;

const dl = new Dl({ country: "United States of America", name: "Dogglounge", segDuration: 2 });

dl.on("metadata", function(data) {
	log.info("metadata received\n" + JSON.stringify(data, null, "\t"));
	//log.info("metadata url=" + data.url + " codec=" + data.codec + " ext=" + data.ext + " bitrate=" + data.bitrate);
});

dl.on("headers", function(headers) {
	log.info("stream headers\n" + JSON.stringify(headers, null, "\t"));
});

let receivedBytesInSegment = 0;
dl.on("data", function(obj) {
	if (obj.newSegment) {
		log.debug("new segment begins. last segment contained " + receivedBytesInSegment + " bytes");
		receivedBytesInSegment = 0;
	}
	receivedBytesInSegment += obj.data.length;
	log.debug("received " + obj.data.length + " bytes. tBuffer=" + obj.tBuffer.toFixed(2) + "s. newSeg=" + obj.newSegment);
});

dl.on("error", function(err) {
	log.warn("dl err=" + err);
});

//setTimeout(function() {
//	log.info("stopping stream download.");
//	dl.stopDl();
//}, 6000);
