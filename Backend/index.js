var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { userSchema } = require('./schema/user');
const { employeeSchema } = require('./schema/employee');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

let app = express();
app.use(cors());

app.use('/graphql/user', graphqlHTTP((req, res, graphQLParams) => {
  return {
    schema: userSchema,
    graphiql: true,
  };
}));

app.use('/graphql/employee', graphqlHTTP({
  schema: employeeSchema,
  graphiql: true,
}));
app.use(express.static(path.join(__dirname, 'dist/101410182_comp3133_assignment2/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/101410182_comp3133_assignment2/browser', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
