'use strict';

const Homey = require('homey');
const alphanumeric = ['A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r','S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z','1','2','3','4','5','6','7','8','9','0','-'];

class Triggered extends Homey.App {

	async onInit() {
		this.log('Triggered is running...');

		this._homeyID = await Homey.ManagerCloud.getHomeyId();

		this.buttonFlowTrigger = new Homey.FlowCardTrigger('buttonPressed')
			.register()
			.registerRunListener((args, state) => {
                return args.title === state.title;
        	});

		Homey.ManagerSettings.set('buttons', {});
    }

    addButton(data) {
        if (!data.title || !data.secret) return Error('Incorrect data');
        let buttons = Homey.ManagerSettings.get('buttons');
        buttons[data.secret] = data;
        Homey.ManagerSettings.set('buttons', buttons);
        return data;
    }

    checkButton(secret) {
		let button = this.getButton(secret);
		this.log(button);

		if (button && (button.uses === null || button.uses > 0)) {
			this.log('Button pressed!');
			if (button.uses !== null) button.uses--;
			this.addButton(button);

			this.buttonFlowTrigger.trigger(null, button.title);
			return true;
		} else if (button && button.uses === 0) {
            this.log('Last use!');
            this.deleteButton(secret);
			return false
		}

		this.log('Something went wrong here!');
		return false;
	}

	deleteButton(secret) {
        let buttons = Homey.ManagerSettings.get('buttons');
        delete buttons[secret];
        return Homey.ManagerSettings.set('buttons', buttons);
	}

	generateButton(title, uses) {
        let secret = '';

        for(let i = 0; i < 5; i++) secret += alphanumeric[Math.floor(Math.random()*alphanumeric.length)];

        let data = {
        	title,
			secret,
			uses
		};

		return this.addButton(data);
	}

	getButtons() {
		return Homey.ManagerSettings.get('buttons');
	}

	getButton(secret) {
		let buttons = this.getButtons();
		return buttons[secret];
	}

	getButtonUrl(secret) {
		let button = this.getButton(secret);
		return `https://${this._homeyID}.homey.athom.com/app/${Homey.manifest.id}/index.html?t=${button.title}&s=${button.secret}`;
	}
}

module.exports = Triggered;
