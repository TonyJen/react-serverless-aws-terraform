import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const x = "To-do list powered by AWS serverless architecture";
  const linkElement = getByText(new RegExp(x, "i"));
  //expect(linkElement).toBeInTheDocument();
});
