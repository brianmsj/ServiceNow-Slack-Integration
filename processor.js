// This is a global slack processor. It takes the parameters from slack and populates a table I created
//in ServiceNow called u_slash_commands//

(function process(g_request, g_response, g_processor) {
	var app = "slack slash";
	var tablename = "u_slash_commands";

	var record = new GlideRecord(tablename);
	record.setValue("u_method",g_request.getMethod());
	record.setValue("u_querystring",g_request.getQueryString());

	var urlParamList = g_request.getParameterNames();
	while(urlParamList.hasMoreElements()){
		var param = urlParamList.nextElement();
		var value = g_request.getParameter(param);
		record.setValue(formatToSNStandards(param),value);
	}


	var urlheaderList = g_request.getHeaderNames();
	while(urlheaderList.hasMoreElements()){
		var header = urlheaderList.nextElement();
		var headerValue = g_request.getHeader(header);
		record.setValue(formatToSNStandards(header),headerValue);
	}

	record.insert();

    g_processor.writeOutput("Response has been given by NetOps team in closed notes");
	g_response.setStatus(200);





})(g_request, g_response, g_processor);

function formatToSNStandards(string){
	string=string.replace("-","_");
	return "u_"+string;
}
