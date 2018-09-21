const Homey = require('homey');

module.exports = [
    {
        method: 'GET',
        path: '/button/url',
        role: 'owner',
        fn: function (args, callback) {
            let result = Homey.app.getButtonUrl(args.query.secret);
            result ? callback(null, result) : callback('Error getting button url', null);
        }
    },
    {
        method: 'POST',
        path: '/button/new',
        role: 'owner',
        fn: function (args, callback) {
            let result = Homey.app.generateButton(args.body.title, args.body.uses);
            result ? callback(null, result) : callback('Error generating button', null);
        }
    },
    {
        method: 'POST',
        path: '/button/delete',
        role: 'owner',
        fn: function (args, callback) {
            let result = Homey.app.deleteButton(args.body.secret);
            result ? callback(null, result) : callback('Error generating button', null);
        }
    },
    {
        method: 'POST',
        path: '/button',
        public: true,
        fn: function (args, callback) {
            let result = Homey.app.checkButton(args.body.secret);
            result ? callback(null, result) : callback('Button not found', null);
        }
    }
];