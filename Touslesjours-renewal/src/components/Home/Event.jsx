import { assets } from '../../data/home';
import Button from '../common/Button';
import EventCard from '../EventCard';
import './Event.css';

const events = [
  { name: '26년 9월 네이버페이 프로모션', description: ['9월 18일 단 하루!', '네이버페이 포인트·머니로 2만 원 이상 결제하고,', '최대 50% 혜택을 만나보세요.'] },
  { name: '26년 추석 사전 예약', description: ['추석 선물, 미리 준비하면 최대 30% 할인!', '첫 구매 고객은 3천 원 할인 쿠폰을,', '재구매 고객은 앱 할인 쿠폰 2종을 추가로 받아보세요.'] },
  { name: '26년 9월 원클릭 이벤트', description: ['1만 원 이상 구매하면 전 제품 최대 40% 할인!', '뚜레쥬르 앱 원클릭 이벤트 페이지에서 서비스에 동의하고 쿠폰을 다운받아,', '매장에서 간편하게 할인 혜택을 즐겨보세요.'] },
  { name: '26년 현대카드 M50', description: ['뚜레쥬르에서 매일 만나는 M포인트 혜택!', '현대카드 M포인트로 전 제품 결제 금액의 50%를 사용하고,', '매일 부담 없이 달콤한 메뉴를 즐겨보세요.'] },
];

export default function Event({ onSelect }) {
  return <section className="event" id="event" aria-labelledby="event-title"><div className="inner">
    <h2 className="event__title" id="event-title">More Benefits,<br />More Delight</h2>
    <p className="event__intro">뚜레쥬르에서 진행 중인<br />다양한 할인과 혜택을 한눈에 만나보세요.</p>
    <div className="event__grid">{events.map((item, index) => <EventCard
      className="event__card" key={item.name} number={index + 1}
      title={item.name} description={item.description} onClick={() => onSelect(item)}
    />)}</div>
    <div className="event__more"><div><h3>더 많은 혜택</h3><Button href="https://www.tlj.co.kr/">VIEW MORE</Button></div><img src={assets.imgImage381} alt="" width="251" height="224" loading="lazy" /></div>
    <p className="event__notice">이벤트별 기간 및 혜택은 상이하며, 일부 매장 및 제품은 행사 대상에서 제외될 수 있습니다.<br />쿠폰 및 제휴 할인은 중복 적용이 제한될 수 있으며, 자세한 내용은 각 이벤트 페이지에서 확인해 주세요.</p>
  </div></section>;
}
