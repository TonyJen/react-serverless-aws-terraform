import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CommentsList from '../../components/CommentsList';
import Likes from '../../components/Likes';
import { API } from 'aws-amplify';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('aws-amplify', () => ({
  API: {
    get: jest.fn(),
    post: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock('../../components/Likes', () => {
  const MyMockedLikes = (props) => <div {...props} />;
  return MyMockedLikes;
});

describe('CommentsList', () => {
  const todoId = '123';
  const username = 'user';

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('renders loading comments screen while comments are loading', async () => {
    API.get.mockReturnValueOnce(Promise.resolve({ Items: [] }));

    const { getByTestId } = render(
      <CommentsList todoId={todoId} username={username} />
    );

    console.log(getByTestId)

    expect(getByTestId('comments-list')).toBeInTheDocument();
  });
})
/*
  
  it('should add a comment when the form is submitted', () => {
    // Arrange
    const wrapper = shallow(<CommentsList todoId={123} username="test" />);
    const input = wrapper.find('input');
    const button = wrapper.find('button');

    // Act
    input.simulate('change', { target: { value: 'Test comment' } });
    button.simulate('click');

    // Assert
    expect(wrapper.state('formState').content).toEqual('');
    expect(wrapper.state('comments')).toHaveLength(1);
  });
});

  it('adds a comment when the add button is clicked', async () => {
    API.get.mockReturnValueOnce(Promise.resolve({ Items: [] }));
    API.post.mockReturnValueOnce(Promise.resolve());
    API.get.mockReturnValueOnce(
      Promise.resolve({
        Items: [
          {
            commentId: { S: '1' },
            content: { S: 'Comment 1' },
            username: { S: 'user' },
          },
        ],
      })
    );

    const { getByPlaceholderText, getByText } = render(
      <CommentsList todoId={todoId} username={username} />
    );

    fireEvent.change(getByPlaceholderText('Comment'), {
      target: { value: 'Comment 1' },
    });

    fireEvent.click(getByText('Add'));
    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('todos', '/comments', {
        body: {
          content: 'Comment 1',
          todoId: '123',
          username: 'user'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  });
});
*/