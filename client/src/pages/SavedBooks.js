//import relevant hooks and refactor inports from the utils folder//
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';


const SavedBooks = () => {
  const { loading, data: userData } = useQuery({ GET_ME });
  const [removeBook] = useMutation(REMOVE_BOOK);


  // moving JWT code from inside handle delete to SavedBooks
  const token = Auth.loggedIn() ? Auth.getToken() : null;
  if (!token) { return false; }

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({ bookId: bookId });
    } catch (err) {
      console.error(err);
    } removeBookId(bookId);
  };
  //similar render to student mini project, render a message for loading and a message for no books found//
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        {loading ? (
          <div>LOADING...</div>
        ) : (
          <>
            <h2>
              {userData.me.bookCount
                ? `Viewing ${userData.me.bookCount} saved ${userData.me.bookCount === 1 ? 'book' : 'books'}:`
                : 'You have no saved books!'}
            </h2>
            <CardColumns>
              {userData.me.savedBooks.map((book) => {
                return (
                  <Card key={book.bookId} border='dark'>
                    {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <p className='small'>Authors: {book.authors}</p>
                      <Card.Text>{book.description}</Card.Text>
                      <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                        Delete this Book!
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </CardColumns>
          </>
        )}
      </Container>
    </>
  );
};

export default SavedBooks;
