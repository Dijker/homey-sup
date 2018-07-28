const Homey = require('homey');

module.exports = [
    {
        method: 'GET',
        path: '/keys',
        role: 'owner',
        fn: function (args, callback) {
            let result = Homey.app.getKeys();

            if (result instanceof Error) callback(result, null);
            else callback(null, result);
        }
    },
    {
        method: 'POST',
        path: '/key/new',
        public: true,
        role: 'owner',
        fn: function (args, callback) {
            let result = Homey.app.generateKey(args.body.length, args.body.type);

            if (result instanceof Error) callback(result, null);
            else callback(null, result);
        }
    },
    {
        method: 'POST',
        path: '/key',
        public: true,
        fn: function (args, callback) {
            let result = Homey.app.checkKey(args.body.key);
            result ? callback(null, result) : callback('Key not found', null);
        }
    }
];