var Response = function (res) {
  this.res = res;
};

Response.prototype.successful = function(data){
	this.res.status(200).json(data);
};

Response.prototype.userError = function(error_message){
	this.res.status(422).json({status: "error", message: error_message});
};

Response.prototype.serverError = function(error_message){
	this.res.status(500).json({status: "error", message: error_message});
};

module.exports = Response;