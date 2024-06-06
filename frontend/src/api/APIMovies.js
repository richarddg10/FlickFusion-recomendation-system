export async function APIMovies(pages = [1, 2, 3, 4, 5]) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMGRmYzA4Y2ZjMDk0NWRkOWNmODhmZjgyMWE2Y2M3ZCIsInN1YiI6IjY2NTI4NDBiODRiNzQ5YjUzZGY3YzBmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gDC3GzAeblqP1oIDsuyPUNyrSkPJHrUYczInGjb91U8'
        }
    }

    try {
        let allMovies = []

        for (let page of pages) {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}`, options)
            const data = await response.json();
            allMovies = allMovies.concat(data.results)
        }

        console.log(allMovies)
        return allMovies
    } catch (error) {
        console.error('Error al obtener info de películas:', error)
    }
}
