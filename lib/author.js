var url = require('url');
var db = require('./db.js');
var template = require('./template.js');
var qs = require('querystring')

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error, authors){
            var title = 'author';
            var list = template.list(topics);
            var authorList = template.authorList(authors);
            var create = `
            <hr>
            <h3>create author</h3>
            <form action="/author_create_process" method="post">
              <p><input name="name" placeholder="name"></p>
              <p><input name="profile" placeholder="profile"></p>
              <p><input type="submit" value="create">
            </form> `;
            var html = template.HTML(title,list,authorList+create,
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
    var _url = request.url;
	var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function(error, authors){
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error, author){
                var name = author[0].name;
                var profile = author[0].profile;
                var title = 'author';
                var list = template.list(topics);
                var authorList = template.authorList(authors);
                var update = `
                    <hr>
                    <h3>update author</h3>
                    <form action="/author_update_process" method="post">
                        <p><input name="name" placeholder="name" value="${name}"></p>
                        <p><input name="profile" placeholder="profile" value="${profile}"></p>
                        <p><input type="hidden" name="id" value="${queryData.id}"></p>
                        <p><input type="submit" value="update"></p>
                    </form>`;
                var html = template.HTML(title,list,authorList+update,
                    ``);
                response.writeHead(200);
                response.end(html);               
            });
        });
    });
}

exports.update_process = function(request, response){
    var body = '';
	request.on('data', function(data){
		body = body + data;
    });
	request.on('end', function(){
		var post = qs.parse(body);
		var name = post.name;
        var profile = post.profile;
        var id = post.id;
		db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [name, profile, id], function(error, result){
			response.writeHead(302, {Location: `/author`});
			response.end();
		});
	});
} 

exports.delete_process = function(request, response){
    body = '';
    request.on('data', function(data){
        body += data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        console.log(post);
        db.query(`DELETE FROM author WHERE id=?`, [id], function(error, result){
            response.writeHead(302, {Location: `/author`});
            response.end();
        })
    });
}