const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    getSingleUser: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in');
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials entered");
      }
      const correctPw = await User.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials entered");
      }
      const token = signToken(user);
      return { token, user };
    },
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookInfo }, context) => {
      const savedBook = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: bookInfo.body } },
        // must pass new true here///
        { new: true, runValidators: true }
      );
      return savedBook;
    },
    removeBook: async (parent, { bookId }, context) => {
      const removedBook = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }).populate('savedBooks');
    }
  }
}

module.exports = resolvers;