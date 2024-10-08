import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../graphql/schema';

const server = new ApolloServer({ schema });

export default server.createHandler({ path: '/api/graphql' });