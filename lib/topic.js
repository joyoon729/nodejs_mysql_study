var url = require('url');
var qs = require('querystring');
var db = require('./db.js');
var template = require('./template.js');

exports.home = function(request, response){
	db.query(`SELECT * FROM topic`, function(error, topics){
		if(error){
			console.log("home error");
			throw error;    
		} 
		var title = 'Welcome';
		var description = 'Hello, Node.js';
		var list = template.list(topics);
		var html = template.HTML(title, list,
			`<h2>${title}</h2>${description}`,
			`<a href="/create">create</a>`);
		response.writeHead(200);
		response.end(html);
	});
}

exports.page = function(request, response){
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	db.query(`SELECT * FROM topic`, function(error, topics){
		if(error){
				console.log("page error");
				throw error;
		}
		db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error, topic){

			var title = topic[0].title;
			var list = template.list(topics);
			var description = topic[0].description;
			var html = template.HTML(title, list,
				`<h2>${title}</h2>${description}
				<p>by ${topic[0].name}</p>`,
				` <a href="/create">create</a>
				<a href="/update?id=${queryData.id}">update</a>
				<form action="delete_process" method="post">
					<input type="hidden" name="id" value="${queryData.id}">
					<input type="submit" value="delete">
				</form>`);
			response.writeHead(200);
			response.end(html);
		});
	}); 
}

exports.create = function(request, response){
	db.query(`SELECT * FROM topic`, function(error, topics){
		db.query(`SELECT * FROM author`, function(error, authors){
			var title = 'WEB - create';
			var list = template.list(topics);
			var html = template.HTML(title, list, 
				`<form action="/create_process" method="post">
					<p><input type="text" name="title" placeholder="title"></p>
					<p>
						<textarea name="description" placeholder="description"></textarea>
					</p>
					<p>
						${template.selectAuthor(authors)}
					</p>
					<p>
						<input type="submit">
					</p>
				</form>`,
				'');
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
		var title = post.title;
		var description = post.description;
		var author = post.author_id
			
		db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [title, description, author], function(error, result){
			if(error) throw error;
			response.writeHead(302, {Location: `/?id=${result.insertId}`});
			response.end();
		});
	}); 
}

exports.update = function(request, response){
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	db.query(`SELECT * FROM topic`, function(error, topics){
		db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error, topic){
			db.query(`SELECT * FROM author`, function(error, authors){
				var id = topic[0].id;
				var title = topic[0].title;
				var list = template.list(topics);
				var description = topic[0].description;
				var html = template.HTML(title, list,
						`<form action="/update_process" method="post">
							<input type="hidden" name="id" value="${id}">
							<p><input type="text" name="title" placeholder="title" value="${title}"></p>
							<p>
									<textarea name="description" placeholder="description">${description}</textarea>
							</p>
							<p>
									${template.selectAuthor(authors, topic[0].author_id)}
							</p>
							<p>
									<input type="submit">
							</p>
						</form>`,
						`<a href="/create">create</a> <a href="/update?id=${id}">update</a>`);
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
		var id = post.id;
		var title = post.title;
		var description = post.description;
		var author = post.author_id;
		db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [title, description, author, id], function(error, result){
			response.writeHead(302, {Location: `/?id=${id}`});
			response.end();
		});
	});
}

exports.delete = function(request, response){
	var body = '';
	request.on('data', function(data){
		body = body + data;
	});
	request.on('end', function(){
		var post = qs.parse(body);
		var id = post.id;
		db.query(`DELETE FROM topic WHERE id=?`, [id], function(error, result){
			response.writeHead(302, {Location: `/`});
			response.end();
		});
	});
}