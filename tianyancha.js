var Financing = function() {};

Financing.prototype = {
    init: function() {},
    set: function(obj) {
        var defaultData = JSON.parse(LocalContractStorage.get('all'));
        var data = Object.prototype.toString.call(defaultData) == '[object Array]' ? defaultData : [];
        data.push({
            id: obj.id,
            name: obj.name,
            quota: obj.quota,
            content: obj.content,
            progress: obj.progress,
            use: obj.use,
            mailbox: obj.mailbox,
            time: obj.time,
            comment: []
        });
        if (data.length > 1) {
            LocalContractStorage.del('all');
        };
        LocalContractStorage.set('all', JSON.stringify(data));
    },
    get: function() {
        return LocalContractStorage.get('all');
    },
    addComment: function(id, text, time) {
        var data = JSON.parse(LocalContractStorage.get('all'));
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                data[i].comment.push({
                    body: text,
                    time: time
                })
            }
        }
        LocalContractStorage.del('all');
        LocalContractStorage.set('all', JSON.stringify(data));
    }
};

module.exports = Financing;