
function PeerHistory(socket) {
	var self = this;
	this.socket = socket;
	this.listdatapeer = {};	
}

PeerHistory.prototype.add = function(conn) {
	this.listdatapeer[conn.peer] = {
		count_share: 0,
		time_share: new Date()
	};
}

PeerHistory.prototype.update = function(conn) {
	this.listdatapeer[conn.peer].count_share +=1;
	this.listdatapeer[conn.peer].time_share = new Date();
}

PeerHistory.prototype.remove = function(conn) {
	delete this.listdatapeer[conn.peer];
}