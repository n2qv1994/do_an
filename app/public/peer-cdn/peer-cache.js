/**
 * Created by spider on 8/21/15.
 */
function PeerCache(options) {
    this.options = options;
    this.data = {};
}

PeerCache.prototype.cache = function(resource_id, resource) {
    this.data[resource_id] = resource;
};

PeerCache.prototype.get = function(resource_id) {
    return this.data[resource_id];
};

PeerCache.prototype.check = function(resource_id) {
    if(this.data.hasOwnProperty(resource_id)) return true;
    return false;
};

PeerCache.prototype.extendLife = function(resource_id, extend_time) {
    //do nothing
};
