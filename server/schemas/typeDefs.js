const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
       _id: ID
       bookId: String!
       authors: [String]
       description: String
       title: String!
       image: String
       link: String
    }

    type User {
      _id: ID
      username: String
      email: String 
      bookCount: Int
      savedBooks: [Book]!
    }

    type Auth {
      token: ID!
      user: User
    }

    type Query {
      getSingleUser: User
    }

    input BookInfo {
      bookId: String
      authors: [String]
      description: String
      title: String
      image: String
      link: String
    }
    
    type Mutation {
      createUser(username: String!, email: String!, password: String!): Auth
      login(email: String!, password: String!): Auth
      saveBook(input: BookInfo!): User
      removeBook(bookID: String!): User
    }`;

module.exports = typeDefs;