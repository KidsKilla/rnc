import { ImageSourcePropType } from 'react-native';
import { createColor, Color } from '../util/color';

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export const convertImageItem = (imageSrc: ImageSourcePropType) => ({
  id: (Math.random() + Date.now()).toString(36),
  imageSrc,
  color: createColor(getRandomInt(256), getRandomInt(256), getRandomInt(256)),
});

export const DISHES = {
  One: [
    require('./img/kisspng-hamburger-bacon-sushi-pizza-cheeseburger-burger-king-5ab6e57493c515.4236508615219357326053.png'),
    require('./img/kisspng-fish-and-chips-french-fries-moules-frites-panada-r-snacks-fries-french-fries-5a82cf27418957.9034635915185221512685.png'),
  ].map(convertImageItem),

  Two: [
    require('./img/kisspng-greek-salad-vinaigrette-caesar-salad-fruit-salad-salad-5abc15ffee6593.7693796115222758399765.png'),
    require('./img/kisspng-hamburger-street-food-seafood-fast-food-delicious-food-5a75083cceaf41.2676743415176192608466.png'),
    require('./img/kisspng-jamaican-cuisine-fried-fish-escabeche-seafood-fried-fish-5abdd5f5b0ad46.8075501615223905177237.png'),
    require('./img/kisspng-pasta-salad-bolognese-sauce-italian-cuisine-spaghe-spaghetti-5ab9b0b2710e86.3514384615221188344631.png'),
    require('./img/kisspng-pupusa-naan-food-indian-cuisine-paratha-victory-clipart-5ad909a752c411.578681131524173223339.png'),
  ].map(convertImageItem),

  Three: [
    require('./img/kisspng-samosa-indian-cuisine-chaat-stuffing-pizza-samosa-5abe1eee02a908.9185469015224091980109.png'),
  ].map(convertImageItem),
};
