import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { setContext} from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URI = "http://192.168.43.203:4000/";

const httpLink = createHttpLink({
  uri: URI,
});

const authLink = setContext(async (_, { headers }) => { 
  const token = await AsyncStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token || "",
      // authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// export const client = new ApolloClient({
//   uri: URI,
//   cache: new InMemoryCache(),
// });