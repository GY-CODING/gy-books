export interface Series {
  name: string;
  id: number;
}

export interface Cover {
  url: string;
}

export interface AuthorImage {
  url: string;
}

export interface Author {
  id: number;
  name: string;
  image: AuthorImage;
}

export default interface Book {
  id: string;
  title: string;
  series: Series | null;
  cover: Cover;
  releaseDate: string;
  pageCount: number;
  author: Author;
  description: string;
}
