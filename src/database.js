const mongoose = require('mongoose');
const { mongodb } = require('./keys');


mongoose.connect(mongodb.atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err));