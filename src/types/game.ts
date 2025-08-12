export interface Game {
  id: number;
  title: string;
  image: string;
  price: number;
  discount?: number;
  discountDate: string;
  hasDlc: boolean;
  rating: number;
  popularity: number;
  genres: string[];
  platforms: string[];
  systems: string[];
  releaseDate: string;
  reviews?: number;
  preOrder: boolean;
}
