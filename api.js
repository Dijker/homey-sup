const Homey = require('homey');

module.exports = [
    {
        method: 'GET',
        path: '/button/url',
        role: 'owner',
        fn: function (args, callback) {
            if (!args.query.secret) callback('No data provided', null);

            let result = Homey.app.getButtonUrl(args.query.secret);
            result ? callback(null, result) : callback(`Error getting button url: ${result}`, null);
        }
    },
    {
        method: 'POST',
        path: '/button/new',
        role: 'owner',
        fn: function (args, callback) {
            if (!args.body.title) callback('Title missing', null);
            if (!typeof args.body.uses === 'number' || !typeof args.body.uses === null) callback('Uses invalid, keep empty or enter a number.', null);

            let result = Homey.app.generateButton(args.body.title, args.body.uses);
            result ? callback(null, result) : callback(`Error generating button: ${result}`, null);
        }
    },
    {
        method: 'POST',
        path: '/button/delete',
        role: 'owner',
        fn: function (args, callback) {
            if (!args.body.secret) callback('No data provided', null);

            let result = Homey.app.deleteButton(args.body.secret);
            result ? callback(null, result) : callback(`Error deleting button: ${result}`, null);
        }
    },
    {
        method: 'POST',
        path: '/button',
        public: true,
        fn: function (args, callback) {
            if (!args.body.secret) callback('No data provided', null);

            let result = Homey.app.checkButton(args.body.secret);
            result ? callback(null, result) : callback(`Button not found: ${result}`, null);
        }
    }
];
