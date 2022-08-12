const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getToken = (user) =>
  jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30 days" });

const getUserFromToken = async (token, db) => {

  if (!token) return null;

  const tokenData = jwt.verify(token, JWT_SECRET);

  if (!tokenData?.id) return null; 
  
  return await db.collection("Users").findOne({ _id: ObjectId(tokenData.id) }); 
};

const typeDefs = gql`
  type Query {
    myTaskLists: [TaskList!]!
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthUser
    signIn(input: SignInInput!): AuthUser

    createTaskList(title: String!): TaskList! 
  }

  input SignUpInput {
    email: String!
    password: String!
    name: String!
    avatar: String
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type AuthUser {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type TaskList {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!

    users: [User!]!
    todos: [Todo!]!
  }

  type Todo {
    id: ID!
    content: String!
    isCompleted: Boolean!

    taskList: TaskList
  }
`;

const resolvers = {
  Query: {
    myTaskLists: () => [],
  },
  Mutation: {
    signUp: async (_, { input }, { db}) => {
      // Hash the password
      const hashedPassword = bcrypt.hashSync(input.password);
      // Create the user
      const newUuser = {
        ...input,
        password: hashedPassword,
      };

      // Save user to database
      const result = await db.collection("Users").insert(newUuser);
      // console.log(result.insertedIds["0"].toString());
      const id = result.insertedIds["0"].toString();

      const user = {
        ...newUuser,
        _id: id,
      };
      // console.log(user)
      return {
        user,
        token: getToken(user),
      };
    },
    signIn: async (_, { input }, { db }) => {
      const user = await db.collection("Users").findOne({ email: input.email });
      // Ckeck is user exist
      if (!user) throw new Error("Invalid Credentials!");

      //Check if password correct
      const isPassswordCorrect = bcrypt.compareSync(
        input.password,
        user.password
      );

      if (!isPassswordCorrect) throw new Error("Invalid Credentials!");

      return {
        user,
        token: getToken(user),
      };
    },
  },
  User: {
    id: (root) => {
      // console.log(root)
      return root._id;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const startServer = async () => {
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  await client.connect();
  const db = client.db(DB_NAME);

  // const context = {
  //   db,
  // };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    context: async ({ req }) => {
      // console.log(headers);
      const user = await getUserFromToken(req.headers.authorization, db);
      // console.log(user);
      return {
        db,
        user,
      };
    },

    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

startServer();
