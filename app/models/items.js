exports.definition = {
	config: {
		columns: {
			"name": "TEXT",
			"description": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "items"
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