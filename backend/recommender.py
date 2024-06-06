def find_similar_movies(selected_movie, movies):
    similar_movies = [movie for movie in movies if (
        movie['id'] != selected_movie['id'] and
        any(genre_id in selected_movie['genre_ids'] for genre_id in movie['genre_ids']) and
        movie['release_date'][:4] == selected_movie['release_date'][:4]
    )]
    return similar_movies

def get_recommended_movies(liked_movies, movies):
    recommended_movies = []
    for liked_movie in liked_movies:
        similar_movies = find_similar_movies(liked_movie, movies)
        recommended_movies.extend(similar_movies)

    # Eliminar duplicados
    recommended_movies = [
        movie for index, movie in enumerate(recommended_movies)
        if recommended_movies.index(movie) == index
    ]

    return recommended_movies
