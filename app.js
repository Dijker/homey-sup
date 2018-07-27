'use strict';

const Homey = require('homey');
const alphanumeric = ['A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r','S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z','1','2','3','4','5','6','7','8','9','0','-'];

class SUPapp extends Homey.App {
	
	async onInit() {
		this.log('SUP is running...');

		this._homeyID = await Homey.ManagerCloud.getHomeyId();

		this.keys = {};

		this.keyFlowTrigger = new Homey.FlowCardTrigger('keyEntered')
			.register()
			.registerRunListener((args, state) => {
                return args.type === state.type;
        	});

		this.keyGenTrigger = new Homey.FlowCardTrigger('keyGenerated')
			.register();

		this.keyGenAction = new Homey.FlowCardAction('generateKey')
			.register()
			.registerRunListener((args, state) => {
				return this.generateKey(args.length, args.type);
			});
    }

    addKey(data) {
        if (!data.key || !data.type) return Error('Incorrect type or null value of key or type');
        return this.keys[data.key] = data;
    }

    checkKey(id) {
		let key = this.getKey(id);

		if (key) {
			this.deleteKey(id);
			this.keyFlowTrigger.trigger(null, key);
			return true;
		} else return false;
	}

	deleteKey(id) {
		return delete this.keys[id];
	}

	generateKey(length, type) {
        let key = '';

        while (length--) key += alphanumeric[Math.floor(Math.random()*alphanumeric.length)];

        let data = {
        	key,
			type,
		};

        this.keyGenTrigger.trigger({
			URL: `https://${this._homeyID}.homey.athom.com/app/${Homey.manifest.id}/index.html?key=${key}`
		});

		return this.addKey(data);
	}

	getKeys() {
		return this.keys;
	}

	getKey(id) {
		return this.keys[id];
	}
}

module.exports = SUPapp;