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
    getTaskList(id: ID!): TaskList
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthUser
    signIn(input: SignInInput!): AuthUser

    createTaskList(title: String!): TaskList!
    updateTaskList(id: ID!, title: String!): TaskList!
    deleteTaskList(id: ID!): Boolean!
    addUserToTaskList(taskListId: ID!, userId: ID!): TaskList

    createToDo(content: String!, taskListId: ID!): ToDo!
    updateToDo(id: ID, content: String, isCompleted: Boolean): ToDo!
    deleteToDo(id: ID!): Boolean!
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
    todos: [ToDo!]!
  }

  type ToDo {
    id: ID!
    content: String!
    isCompleted: Boolean!

    taskList: TaskList
  }
`;

const resolvers = {
  Query: {
    myTaskLists: async (_, __, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");
      // return db.collection("TaskList").find({ userIds: { $in: [user._id] } }).toArray(); OR AS FOLLOWS
      return await db
        .collection("TaskList")
        .find({ userIds: user._id })
        .toArray();
    },
    getTaskList: async (_, { id }, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");
      return await db.collection("TaskList").findOne({ _id: ObjectId(id) });
    },
  },
  Mutation: {
    signUp: async (_, { input }, { db }) => {
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
    createTaskList: async (_, { title }, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");

      const newTaskList = {
        title,
        createdAt: new Date().toISOString(),
        userIds: [user._id],
      };

      const result = await db.collection("TaskList").insert(newTaskList);
      // console.log(result.insertedIds["0"].toString());
      const id = result.insertedIds["0"].toString();
      const taskList = {
        ...newTaskList,
        _id: id,
      };
      return taskList;
    },
    updateTaskList: async (_, { id, title }, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");
      const taskList = await db
        .collection("TaskList")
        .findOne({ _id: ObjectId(id) });
      if (!taskList) throw new Error("TaskList not found!");
      const result = await db
        .collection("TaskList")
        .updateOne({ _id: ObjectId(id) }, { $set: { title } });
      return await db.collection("TaskList").findOne({ _id: ObjectId(id) });
    },
    deleteTaskList: async (_, { id }, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");
      const taskList = await db
        .collection("TaskList")
        .findOne({ _id: ObjectId(id) });
      if (!taskList) throw new Error("TaskList not found!");
      const result = await db
        .collection("TaskList")
        .deleteOne({ _id: ObjectId(id) });
      return result.deletedCount === 1;
    },
    addUserToTaskList: async (_, { taskListId, userId }, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");
      const taskList = await db
        .collection("TaskList")
        .findOne({ _id: ObjectId(taskListId) });
      if (!taskList) throw new Error("TaskList not found!");
      if (taskList.userIds.find((dbId) => dbId.toString() == userId))
        return taskList;
      await db
        .collection("TaskList")
        .updateOne(
          { _id: ObjectId(taskListId) },
          { $push: { userIds: ObjectId(userId) } }
        );
      taskList.userIds.push(ObjectId(userId));
      return taskList;
    },
    createToDo: async (_, { content, taskListId }, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");
      const taskList = await db
        .collection("TaskList")
        .findOne({ _id: ObjectId(taskListId) });
      if (!taskList) throw new Error("TaskList not found!");
      const newTodo = {
        content,
        isCompleted: false,
        taskListId: taskList._id,
      };
      const result = await db.collection("ToDo").insert(newTodo);
      const id = result.insertedIds["0"].toString();
      const todo = {
        ...newTodo,
        _id: id,
      };
      return todo;
    },
    updateToDo: async (_, data, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");
      const todo = await db
        .collection("ToDo")
        .findOne({ _id: ObjectId(data.id) });
      if (!todo) throw new Error("ToDo not found!");
      const result = await db
        .collection("ToDo")
        .updateOne({ _id: ObjectId(data.id) }, { $set: { data } });
      return await db.collection("ToDo").findOne({ _id: ObjectId(data.id) });
    },
    deleteToDo: async (_, { id }, { db, user }) => {
      if (!user) throw new Error("Athentication error, Please signin!");
      const todo = await db.collection("ToDo").findOne({ _id: ObjectId(id) });
      if (!todo) throw new Error("ToDo not found!");
      const result = await db
        .collection("ToDo")
        .deleteOne({ _id: ObjectId(id) });
      return result.deletedCount === 1;
    },
  },
  User: {
    id: (root) => root._id || root.id,
  },

  TaskList: {
    id: (root) => root._id || root.id,
    progress: async (root, _, { db }) => {
      const todos = await db
        .collection("ToDo")
        .find({ taskListId: ObjectId(root._id) })
        .toArray();
      const isCompleted = todos.filter((todo) => todo.isCompleted);

      if (todos.legth == 0) return 0;

      return (100 * isCompleted.length) / todos.length;
    },
    users: async (root, _, { db }) => {
      return await Promise.all(
        root.userIds.map((userId) =>
          db.collection("Users").findOne({ _id: userId })
        )
      );
    },
    todos: async (root, _, { db }) => {
      const todos = await db
        .collection("ToDo")
        .find({ taskListId: root._id })
        .toArray();
      return todos;
    },
  },
  ToDo: {
    id: (root) => root._id || root.id,
    taskList: async (root, _, { db }) => {
      return await db.collection("TaskList").findOne({ _id: root.taskListId });
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
