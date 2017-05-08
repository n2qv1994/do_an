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
    //n2qv
    if(this.size + current_size > this.size_limit){//need remove some data
        while(self.size + current_size > self.size_limit && self.list.length > 0){
            console.log("Free cache for release memory:" + self.list[0]);
            self.size -= self.data[self.list[0]].byteLength;
            delete self.data[self.list[0]];
            self.list.slice(0, 1);
        }
        // self.size = 0;
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
