
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Notepad' });
};

//NEW

exports.new = function(req, res){
    res.render('new');
};
