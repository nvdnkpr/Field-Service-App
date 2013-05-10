var ACS = require("ti.cloud"),assignments = require("/data/assignments"),outlets = require("/data/outlets"),catalog = require("/data/catalog");

function createUser(){
	ACS.Users.create({
		username:"field_service_rep",
    	password:"Titanium123!",
    	password_confirmation: "Titanium123!",
    	first_name:"Demo User",
    	photo:Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,"/themes/appc-red/assets/iphone/top-nav/appc-logo.png").read()
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
	
	var count = 0;
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
				if(e.success ==1){
					assignments.data[count].outlet_id = e.outlets[0].id;
					count++
					if(count == outlets.data.length){
						createCatalog(userID);
					}
				} else {
					alert(e.message);
				}
				
			});
		} 	
	}
}

function createCatalog(userID){
	
	var count = 0;
	if (catalog.data && catalog.data.length > 0) {
		for (i = 0; i < catalog.data.length; i++) {
			ACS.Objects.create({
				classname: 'catalog',
				user_id: userID,
				fields: {
					name: catalog.data[i].name,
					description: catalog.data[i].description,
					status: catalog.data[i].status,
					cid: catalog.data[i].cid
				}

			}, function(e) {
				if(e.success ==1){
					count++;
					if(i == catalog.data.length){
						createAssignments(userID);
					}
				} else {
					alert(e.message);
				}
			});
		}
	}
}

function createAssignments(userID){
	var count = 0;
	if (assignments && assignments.data.length > 0) {
		for (i = 0; i < assignments.data.length; i++) {
			ACS.Objects.create({
				classname: 'assignment',
				user_id: userID,
				fields: {
					aid: assignments.data[i].aid,
					dateM: assignments.data[i].dateModified,
					dateC: assignments.data[i].dateCreate,
					dateA: assignments.data[i].dateActive,
					assigneduser: assignments.data[i].userID,
					"[CUSTOM_outlets]outlet_id": assignments.data[i].outlet_id,
					oid: assignments.data[i].oid,
					status: assignments.data[i].status
				}
			}, function(e) {
				if(e.success ==1){
					count++;
					if(count == assignments.data.length-1){
						alert("A demo user and demo data has been created.\n\nusername:field_service_rep\npassword:Titanium123!\n\nThis data is hard coded so you can login with blank fields.");
					}
				} else {
					alert(e.message);
				}
			});
		}
	}
}

exports.createUser = createUser;
