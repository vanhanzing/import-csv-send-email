const express = require('express');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const path = require('path');

// Initializes and adds the database.

const app = express();

// default option
app.use(fileUpload());

// Static Files
app.use(express.static('public'));
app.use(express.static('upload'));
// Handlebars
app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: 'views/layout/',
    helpers: {
      math: function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          '+': lvalue + rvalue,
        }[operator];
      },
    },
  })
);
app.set('view engine', 'handlebars');

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.emailRecord = {};
  next();
});

// Index route
app.get('/', (req, res) =>
  res.render('dashboard/dashboard', { layout: 'main' })
);

app.use('/', require('./routes/index'));

const PORT = 5000;

// app.listen(PORT, console.log(`Server started on port ${PORT}`));

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
  console.log(`url: http://localhost:${PORT}`);
});
