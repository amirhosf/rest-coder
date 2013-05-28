function generalRequest(requestObj, callback)
{ 
	console.log("forwarding request...");
	var request = require("request");
	
	request({
	    	uri: requestObj.baseUrl+requestObj.path,
	    	method: requestObj.method,
		headers: {"Content-Type" : '\"'+requestObj.contentType+'\"'},
		body: requestObj.payload,
	    	timeout: 10000,
	    	followRedirect: true,
	    	maxRedirects: 10
	}, function(error, res, body) {
	
	    callback(error, res,  body);
	  
	});

}
exports.generalRequest = generalRequest;
