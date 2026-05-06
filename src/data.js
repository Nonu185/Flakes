export const mockMovies = [
  { 
    imdbID: 'm1', 
    Title: 'Interstellar', 
    Year: '2014', 
    Type: 'movie',
    Poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800',
    Plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    imdbRating: '8.7',
    Runtime: '169 min',
    Rated: 'PG-13',
    Genre: 'Adventure, Drama, Sci-Fi',
    Actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain'
  },
  { 
    imdbID: 'm2', 
    Title: 'Inception', 
    Year: '2010', 
    Type: 'movie',
    Poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    imdbRating: '8.8',
    Runtime: '148 min',
    Rated: 'PG-13',
    Genre: 'Action, Adventure, Sci-Fi',
    Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page'
  },
  { 
    imdbID: 'm3', 
    Title: 'The Dark Knight', 
    Year: '2008', 
    Type: 'movie',
    Poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800',
    Plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    imdbRating: '9.0',
    Runtime: '152 min',
    Rated: 'PG-13',
    Genre: 'Action, Crime, Drama',
    Actors: 'Christian Bale, Heath Ledger, Aaron Eckhart'
  },
  { 
    imdbID: 'm4', 
    Title: 'The Matrix', 
    Year: '1999', 
    Type: 'movie',
    Poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800',
    Plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    imdbRating: '8.7',
    Runtime: '136 min',
    Rated: 'R',
    Genre: 'Action, Sci-Fi',
    Actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss'
  },
  { 
    imdbID: 'm5', 
    Title: 'Pulp Fiction', 
    Year: '1994', 
    Type: 'movie',
    Poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800',
    Plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    imdbRating: '8.9',
    Runtime: '154 min',
    Rated: 'R',
    Genre: 'Crime, Drama',
    Actors: 'John Travolta, Uma Thurman, Samuel L. Jackson'
  },
  { 
    imdbID: 'm6', 
    Title: 'Avatar', 
    Year: '2009', 
    Type: 'movie',
    Poster: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&q=80&w=800',
    Plot: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    imdbRating: '7.9',
    Runtime: '162 min',
    Rated: 'PG-13',
    Genre: 'Action, Adventure, Fantasy',
    Actors: 'Sam Worthington, Zoe Saldana, Sigourney Weaver'
  }
];

export const getMockData = (count = 6) => {
  const shuffled = [...mockMovies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
