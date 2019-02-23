var db = require('./db.js');
var template = require('./template.js');
var qs = require('querystring')

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error, authors){
            var title = 'author';
            var list = template.list(topics);
            var authorList = template.authorList(authors);
            var html = template.HTML(title,list,authorList,
                ``);

            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function(request, response){
    var body = '';
	request.on('data', function(data){
		body = body + data;
	});
	request.on('end', function(){
		var post = qs.parse(body);
		var name = post.name;
        var profile = post.profile;
			
		db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [name, profile], function(error, result){
			if(error) {console.log("author insert error"); throw error;}
			response.writeHead(302, {Location: `/author`});
			response.end();
		});
	}); 
}

exports.update = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error, authors){
            var title = 'author';
            var list = template.list(topics);
            var authorList = template.authorList(authors);
            var html = template.HTML(title,list,authorList,
                ``);

            response.writeHead(200);
            response.end(html);
        });
    });
}