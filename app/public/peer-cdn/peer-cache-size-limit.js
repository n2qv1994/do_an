/**
 * Created by spider on 8/21/15.
 */
function PeerCacheSizeLimit(options) {
    this.size_limit = options.size_limit;
    this.data = {};
    this.list = [];
    this.size = 0;
}

PeerCacheSizeLimit.prototype.cache = function(resource_id, resource) {
    var current_size = resource.byteLength ;
    var self = this;
    console.log("Adding cache " + resource_id + " size: " + current_size + " now_cache_size:" + this.size + " size_limit:" + this.size_limit);

    if(this.size + current_size > this.size_limit){//need remove some data
        while(this.size + current_size > this.size_limit && this.list.length > 0){
            console.log("Free cache for release memory:" + this.list[0]);
            this.size -= this.data[this.list[0]].byteLength ;
            delete this.data[this.list[0]];
            this.list.slice(0, 1);
        }
    }

    if(this.size + current_size <= this.size_limit){
        console.log("Added cache for " + resource_id);
        this.list.push(resource_id);
        this.data[resource_id] = resource;
        this.size += current_size;
    }
};

PeerCacheSizeLimit.prototype.get = function(resource_id) {
    console.log("Get cached: " + resource_id, this.data, this.data[resource_id]);
    console.log(resource_id, this.data);
    return this.data[resource_id];
};

PeerCacheSizeLimit.prototype.check = function(resource_id) {
    var result = this.data.hasOwnProperty(resource_id);
    console.log("Is cached: " + resource_id + " -> " + result, this.data);
    return result;
};

PeerCacheSizeLimit.prototype.extendLife = function(resource_id, extend_time) {
    //do nothing
};
