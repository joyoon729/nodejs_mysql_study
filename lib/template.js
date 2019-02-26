module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
      <style>
        table{
          border-collapse: collapse;
        }
        th, td{
          border: 1px solid black;
        }
      </style>
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){    
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },selectAuthor:function(authors, selected_author){
    var tag = '';
    for(var i in authors){
      var selected = '';
      if(authors[i].id === selected_author) selected = ' selected';
      tag += `
        <option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
    }
    return `
      <select name="author_id">
        ${tag}
      </select>`
  },authorList:function(authors){
    var body = '<table>';
    body += `
      <tr>
        <th>name</th>
        <th>profile</th>
      </tr>`;

    for(var i in authors){
      body += `
        <tr>
          <td>${authors[i].name}</td>
          <td>${authors[i].profile}</td>
          <td>
            <a href="/author_update?id=${authors[i].id}">update</a>
          </td>
          <td>
            <form action="author_delete_process" method="post">
              <input type="hidden" name="id" value="${authors[i].id}">
              <input type="submit" value="delete">
            </form>
          </td>
        </tr>`
    } 

    body += '</table>';

    return body;
  }
}
