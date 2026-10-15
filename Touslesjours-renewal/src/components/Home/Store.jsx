import { assets } from '../../data/home';
import Button from '../common/Button';
import './Store.css';

const letters = 'TOUSlesJOURS'.split('');
// Figma 80:1405: x, y, bounding width/height, glyph width/height, rotation, skew, scaleY.
const letterGeometry = [
  [483,289.1102,97.599,104.989,50.9691,92.9288,-53.87,0,1],
  [521.8779,244.0556,98.478,116.215,59.9543,92.9434,-39.25,0,1],
  [576.1777,206.7895,87.351,112.913,54.949,92.9562,-27.579,0,1],
  [637.249,182.1826,72.16,106.605,49.9461,92.9661,-16.123,0,1],
  [716.6416,173.2154,30.877,94.663,21.9743,92.9714,-5.559,0,1],
  [750.0898,170.9993,48.268,94.097,45.9457,92.9721,-1.44,0,1],
  [803.2998,172.1348,44.579,96.485,43.9483,92.9722,-0.477,0,1],
  [855.6603,178.7852,67.638,106.603,43.9544,92.965,17.888,0,1],
  [892.1083,194.082,87.478,104.75,48.0648,88.8817,39.333,0,1],
  [945.6998,229.0605,87.63,108.271,55.0069,86.6682,32.796,0,1],
  [989.89,269.61,103.884,112.878,69.737,83.673,47.85,4.83,1],
  [1025.56,316.45,91.439,90.553,46.635,82.47,50.84,2.11,1],
];

export default function Store() {
  return <section className="store" id="store" aria-labelledby="store-title">
    <img className="store__background" src={assets.imgBackground} alt="" loading="lazy" />
    <img className="store__decoration" src={assets.imgImage70} alt="" loading="lazy" />
    <div className="inner store__inner"><div className="store__arch-label" aria-label="TOUS les JOURS">{letters.map((letter,i) => {
      const [x,y,width,height,glyphWidth,glyphHeight,rotation,skew,scaleY] = letterGeometry[i];
      return <span className="store__arch-letter" aria-hidden="true" key={i} style={{ '--letter-x': `${x-483}px`, '--letter-y': `${y-171}px`, '--letter-width': `${width}px`, '--letter-height': `${height}px`, '--glyph-width': `${glyphWidth}px`, '--glyph-height': `${glyphHeight}px`, '--letter-transform': `rotate(${rotation}deg) scaleY(${scaleY}) skewX(${skew}deg)` }}><span className="store__arch-glyph">{letter}</span></span>;
    })}</div>
      <div className="store__photo"><img src={assets.imgRectangle1} alt="초록색 간판과 따뜻한 조명이 있는 뚜레쥬르 매장" loading="lazy" /></div>
      <h2 className="store__title" id="store-title">가까운 뚜레쥬르에서<br />갓 구운 신선함을 만나보세요.</h2>
      <p className="store__description">일상의 가까운 곳에, 뚜레쥬르가 있습니다.</p>
      <Button href="https://www.tlj.co.kr/store/search.asp">매장찾기</Button>
    </div>
  </section>;
}
