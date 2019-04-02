//takes values from slash command table and populates the closed notes
(function executeRule(current, previous /*null when async*/) {

	var number = current.u_text.slice(0,9);

	var gr = new GlideRecord('sn_customerservice_case');
	    gr.addQuery('number',number);
		gr.query();
		while(gr.next()) {
		gr.getValue('close_notes');
		gr.setValue('close_notes', current.u_user_name + ' has set resolution notes of ' + current.u_text.slice(10));
		gr.setWorkflow(false);
		gr.update();
		}

})(current, previous);

//Sends slack message when a trigger event is fired
(function executeRule(current, previous /*null when async*/) {

 try {


 var r = new sn_ws.RESTMessageV2('SlackMessage', 'post');
 r.setStringParameterNoEscape('assigned_to', current.getDisplayValue('assigned_to'));
 r.setStringParameterNoEscape('short_description',current.short_description);
 r.setStringParameterNoEscape('number', current.number);
 r.setStringParameterNoEscape('work_notes', current.work_notes);

//override authentication profile
//authentication type ='basic'/ 'oauth2'
//r.setAuthentication(authentication type, profile name);

//set a MID server name if one wants to run the message on MID
//r.setMIDServer('MY_MID_SERVER');

//if the message is configured to communicate through ECC queue, either
//by setting a MID server or calling executeAsync, one needs to set skip_sensor
//to true. Otherwise, one may get an intermittent error that the response body is null
//r.setEccParameter('skip_sensor', true);

 r.execute();
}
catch(ex) {
 var message = ex.message;
}
})(current, previous);
