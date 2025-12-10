// Wasz adres api oddaje 10 zdjęć
// const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=6'
// moje oddaje tyle ile powinno i moj kot jest na zdjęciach :)
const API_URL = 'https://grysinski.pl/~zolty/cats/api.php?number=6'

export interface CatImage {
  url: string
}

export const CatService = {
  async fetchCats(): Promise<string[]> {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch cat images')
    }

    const data: CatImage[] = await response.json()

    return data
      .map((item) => item.url)
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
  },
}
