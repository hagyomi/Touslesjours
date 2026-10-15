import { breadProducts } from './bread';
import { cakeProducts } from './cake';
import { deliProducts } from './deli';
import { dessertProducts } from './desserts';
import { drinkProducts } from './drinks';
import { giftMenuProducts } from './giftMenu';
import { officialCakeProducts } from './officialCakes';
import { officialRollProducts } from './officialRolls';
import { officialGiftProducts } from './officialGifts';

export const menuCatalog = {
  Bread: breadProducts,
  Cake: cakeProducts,
  Deli: deliProducts,
  Desserts: dessertProducts,
  Drinks: drinkProducts,
  Gift: giftMenuProducts,
};

export const currentMenuProducts = Object.values(menuCatalog).flat();

export function getGiftCollectionProducts(name) {
  if (name === 'Cake') return officialCakeProducts;
  if (name === 'Roll Cake') return officialRollProducts;
  if (name === 'Gift Set') return officialGiftProducts;
  return currentMenuProducts.filter(product => product.collection === name);
}
