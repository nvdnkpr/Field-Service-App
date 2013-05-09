exports.definition = {
	config: {
		columns: {
			"name": "TEXT",
			"address": "TEXT",
			"city": "TEXT",
			"state": "TEXT",
			"zip": "TEXT",
			"phone": "TEXT",
			"contactName": "TEXT",
			"contactPhone": "TEXT",
			"latitude": "TEXT",
			"longitude": "TEXT",
			"oid": "TEXT",
			"id": "TEXT",
			"status": "TEXT",
			"dateM": "TEXT",
			"dateC": "TEXT",
			"dateA": "TEXT",
			"aid": "TEXT",
			"taskCount": "TEXT",
			"search": "TEXT",
			"contactEmail": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "outlets",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
}