/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const React = require('react');
exports.BookCardCompact = ({ book }) =>
  React.createElement('div', { 'data-testid': 'book-card' }, book?.title || '');
