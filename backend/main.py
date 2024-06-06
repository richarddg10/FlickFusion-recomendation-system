from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from recommender import find_similar_movies, get_recommended_movies

app = Flask(__name__)
CORS(app)

movies = []

def fetch_movies_from_tmdb():
    api_key = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMGRmYzA4Y2ZjMDk0NWRkOWNmODhmZjgyMWE2Y2M3ZCIsInN1YiI6IjY2NTI4NDBiODRiNzQ5YjUzZGY3YzBmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gDC3GzAeblqP1oIDsuyPUNyrSkPJHrUYczInGjb91U8'
    url = 'https://api.themoviedb.org/3/discover/movie'
    headers = {
        'accept': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    all_movies = []

    for page in range(1, 6):
        params = {'page': page}
        response = requests.get(url, params=params, headers=headers)
        if response.status_code == 200:
            data = response.json()
            all_movies.extend(data['results'])
        else:
            print(f'Error al obtener datos de películas del API de TMDb (Página {page})')
    print("Información de películas obtenida correctamente:", all_movies)
    return all_movies

def load_movies():
    global movies
    movies.extend(fetch_movies_from_tmdb())

@app.route('/recommendations', methods=['POST'])
def recommendations():
    global movies

    data = request.json
    liked_movie = data.get('liked_movie')
    selected_movie = data.get('selected_movie')

    if liked_movie:
        movies.append(liked_movie)
        similar_movies = find_similar_movies(liked_movie, movies)
        recommended_movies = get_recommended_movies([liked_movie], movies)
    elif selected_movie:
        similar_movies = find_similar_movies(selected_movie, movies)
        recommended_movies = get_recommended_movies([selected_movie], movies)
    else:
        return jsonify({'error': 'No movie provided'})
    
    movies.extend(recommended_movies)

    return jsonify({'similar_movies': similar_movies, 'recommended_movies': recommended_movies})

if __name__ == '__main__':
    load_movies()
    app.run(debug=True, port=5000)
