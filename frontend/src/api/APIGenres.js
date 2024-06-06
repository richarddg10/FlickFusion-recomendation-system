export const genreMap = {}

export async function APIGenres() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMGRmYzA4Y2ZjMDk0NWRkOWNmODhmZjgyMWE2Y2M3ZCIsInN1YiI6IjY2NTI4NDBiODRiNzQ5YjUzZGY3YzBmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gDC3GzAeblqP1oIDsuyPUNyrSkPJHrUYczInGjb91U8'
        }
    }

    try {
        const response = await fetch('https://api.themoviedb.org/3/genre/movie/list', options)
        const data = await response.json()

        data.genres.forEach(genre => {
            genreMap[genre.id] = genre.name
        })

        console.log(genreMap)
        return data.genres
    } catch (error) {
        console.error('Error al obtener los géneros:', error)
        return []
    }
}
