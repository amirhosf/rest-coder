submitOperation = function (baseUrl, path, methodType, operationID){

///////////\\\\\\\\\\ Parsing the posted data to format path and payload ///////////\\\\\\\\\\
//Check which of the posted data should be added to the path
var formData =  $("#"+operationID+"_form").serializeArray();

var path = path;
var pathValue = "";
if(path.indexOf("{") !== -1)
{
	path = path.replace("/{", "");
	path = path.replace("}", "");
}
else
{
	pathValue = path; //Path is not dependent to any post field
}

var contentType = "";// The Content-Type of the form submitted. Assumes that different fields have the same format
var formPayload = "{";
$.each(formData, function(i, fd) {
    if(fd.name === path) 
	pathValue += "/"+fd.value;

    //Forming the JSON payload
    if(fd.value != "" && fd.name != "contentType")
    {
	//Check the case that the input type is a list of some type (ex: list(string))
	//In this case the expected user input should be formated like this: input1, input2
	//And it should be transformed to this: ["input1", "input2"]
	if($("#"+operationID+"_"+fd.name+"_parameter_type").html().indexOf("list") >= 0 )
	{
		fd.value = fd.value.replace(',', '\",\"'); //replace , with "," as a separator
		formPayload += '\"'+fd.name+'\"' + ":" + '[\"'+fd.value+'\"]';
	}
	else
	{
		formPayload += '\"'+fd.name+'\"' + ":" + '\"'+fd.value+'\"';
	}
    }
    else
	{
		if (fd.name == "contentType")	
			contentType = fd.value; //Set the contentType to the correct type
	}
     	
	
});   
formPayload += "}";
formPayload= formPayload.replace('\"\"', '\",\"'); 
//formPayload = '{"drink" : "cappuccinos" , "additions" : ["cream"]}';

///////////\\\\\\\\\\ Sending the request ///////////\\\\\\\\\\

var requestObj =
{
	url: 'http://localhost:3000/',
	type: methodType.toUpperCase(),
	data: {
		"baseUrl": baseUrl, 
		"path": pathValue,
		"contentType":"application/json",
		"payload": formPayload
		},
        cache: false,
        timeout: 5000,
        success: function(payload) {
		$(".responseField").empty();
		$("#"+operationID+"_request_url").append(payload.request_url);
		$("#"+operationID+"_response_body").append("<pre class='json'><code>"+syntaxHighlight(payload.body)+"</code></pre>");
		$("#"+operationID+"_response_code").append(payload.code);
		$("#"+operationID+"_response_headers").append(syntaxHighlight(payload.headers));
        
	},
        error: function(jqXHR, textStatus, errorThrown) {
		//alert(jqXHR);
		$("#"+operationID+"_request_url").append(baseUrl + pathValue);
		$("#"+operationID+"_response_body").append(syntaxHighlight(jqXHR.responseText));

		$("#"+operationID+"_response_code").append(jqXHR.status);
	
		$("#"+operationID+"_response_headers").append(syntaxHighlight(jqXHR.getAllResponseHeaders()));
	
        },
	complete: function(jqXHR, textStatus){
		$("#"+operationID+"_response").slideDown();
	}

};

jQuery.ajax(requestObj);

};


function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, null, 4);
    }
    //json = json.replace(/,/\n/g, "<br>");
    json = json.replace(/,/g, ',\n');
    json = json.replace(/{/g, '\n{\n');
    json = json.replace(/}/g,'\n}\n');
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'attribute';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
	if(cls == "attribute")
		return '<span class="' + cls + '">' + match + '</span>';
	else
        	return '<span class="value"><span class="' + cls + '">' + match + '</span></span>';
	
    });
}

cleanResponse = function(response) {
      var prettyJson;
      prettyJson = response.replace(/\n/g, "<br>");
      return escape(prettyJson);
    };
