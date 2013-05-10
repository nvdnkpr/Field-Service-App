var ACS = require("ti.cloud");
var assignments = require("/data/assignments");

function createUser(){
	ACS.Users.create({
		username:"field_service_rep",
    	password:"Titanium123!",
    	password_confirmation: "Titanium123!",
    	photo:"/themes/appc-red/assets/iphone/top-nav/appc-logo.png"
	}, function(e) {
		if(e.success ==1){
			for(var i in assignments.data){
				assignments.data[i].userID = e.users[0].id
			}
			createOutlets(e.users[0].id);
		} else {
			alert(e.message);
		}
	});
}

	
function createOutlets(userID){
	var outlets = require("/data/outlets");
	
	if (outlets.data && outlets.data.length > 0) {
		for (i = 0; i < outlets.data.length; i++) {
			ACS.Objects.create({
				classname: 'outlets',
				user_id: userID,
				fields: {
					name: outlets.data[i].name,
					orgID: outlets.data[i].orgID,
					address_1: outlets.data[i].address_1,
					City: outlets.data[i].city,
					State: outlets.data[i].state,
					zip: outlets.data[i].zip,
					contactName: outlets.data[i].contact_name,
					contactPhone: outlets.data[i].contact_phone,
					contactEmail: outlets.data[i].contact_email,
					latitude: outlets.data[i].latitude,
					longitude: outlets.data[i].longitude,
					description: outlets.data[i].description,
					status: outlets.data[i].status,
					oid: outlets.data[i].oid
				}
				
			}, function(e) {
				assignments.data[i].outlet_id = e.outlets[0].id;
				if(i = outlets.data.length-1){
					createOutlets();
				}
				
			});
		} 	
	}
	
}

function createCatalog(){
	var catalog = require("/data/catalog");

	if (catalog.data && catalog.data.length > 0) {
		for (i = 0; i < catalog.data.length; i++) {
			ACS.Objects.create({
				classname: 'catalog',
				user_id: admin,
				fields: {
					name: catalog.data[i].name,
					description: catalog.data[i].description,
					status: catalog.data[i].status,
					cid: catalog.data[i].cid
				}

			}, function(e) {
				if(i = catalog.data.length-1){
					createAssignments();
				}
			});
		}
	}
}

function createAssignments(){
	var assign = require("/data/assignments");

	if (assign && assign.data.length > 0) {
		for (i = 0; i < assign.data.length; i++) {
			ACS.Objects.create({
				classname: 'assignment',
				user_id: admin,
				fields: {
					aid: assign.data[i].aid,
					dateM: assign.data[i].dateModified,
					dateC: assign.data[i].dateCreate,
					dateA: assign.data[i].dateActive,
					assigneduser: assign.data[i].userID,
					"[CUSTOM_outlets]outlet_id": assign.data[i].outlet_id,
					oid: assign.data[i].oid,
					status: assign.data[i].status
				}
			}, function(e) {
				if(i = catalog.data.length-1){
					alert("A demo user and demo data has been created.\n\nusername:field_service_rep\npassword:Titanium123!\n\nThis data is hard coded so you can login with blank fields.");
				}
			});
		}
	}
}



