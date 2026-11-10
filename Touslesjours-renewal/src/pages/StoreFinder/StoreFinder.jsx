import { useState } from 'react';
import { stores } from '../../data/stores';
import './StoreFinder.css';

const regions = [...new Set(stores.map(store => store.region))];
const normalize = value => value.replace(/\s/g, '').toLowerCase();

export default function StoreFinder() {
  const [region, setRegion] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const results = stores.filter(store => (!region || store.region === region)
    && normalize(`${store.name} ${store.address}`).includes(normalize(search)));
  const selected = results.find(store => store.id === selectedId) ?? results[0];

  function reset() {
    setRegion('');
    setQuery('');
    setSearch('');
    setSelectedId(null);
  }

  return <main id="main-content" className="store-finder">
    <div className="inner">
      <div className="store-finder__heading">
        <span>FIND YOUR DAILY BREAD</span>
        <h1>매장찾기</h1>
        <p>일상 가까이에서 만나는, 갓 구운 행복.</p>
      </div>
      <form className="store-finder__search" onSubmit={event => { event.preventDefault(); setSearch(query.trim()); setSelectedId(null); }} role="search" aria-label="매장 검색">
        <label>지역<select value={region} onChange={event => { setRegion(event.target.value); setSelectedId(null); }}>
          <option value="">전체 지역</option>
          {regions.map(value => <option key={value} value={value}>{value}</option>)}
        </select></label>
        <label className="store-finder__keyword">매장명 또는 주소<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="예: 마포, 경기, 중흥로" /></label>
        <button className="button store-finder__submit" type="submit">검색</button>
        <button className="store-finder__reset" type="button" onClick={reset}>초기화</button>
      </form>
      <p className="store-finder__count" role="status">검색 결과 <strong>{results.length}</strong>개</p>
      <div className="store-finder__layout">
        <div className="store-finder__results">
          {results.length ? <ul>{results.map(store => <li key={store.id}>
            <button className={`store-finder__item${selected?.id === store.id ? ' store-finder__item--selected' : ''}`} type="button" onClick={() => setSelectedId(store.id)} aria-pressed={selected?.id === store.id} aria-controls="store-details">
              <span className="store-finder__region">{store.region}</span>
              <span className="store-finder__name">뚜레쥬르 {store.name}</span>
              <span className="store-finder__address">{store.address}</span>
              <span className="store-finder__phone">{store.phone}</span>
              <span className="store-finder__arrow" aria-hidden="true">↗</span>
            </button>
          </li>)}</ul> : <div className="store-finder__empty"><h2>검색 결과가 없습니다.</h2><p>다른 지역이나 검색어로 다시 찾아보세요.</p><button className="button" type="button" onClick={reset}>전체 매장 보기</button></div>}
        </div>
        <aside id="store-details" className="store-finder__details" aria-label="선택한 매장 안내" aria-live="polite">
          {selected ? <>
            <span className="store-finder__eyebrow">TOUS les JOURS</span>
            <h2>{selected.name}</h2>
            <p className="store-finder__detail-intro">따뜻한 빵과 함께하는 하루</p>
            <dl><dt>주소</dt><dd>{selected.address}</dd><dt>전화번호</dt><dd><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd></dl>
            <p className="store-finder__visit-note">영업시간 및 이용 가능 서비스는 방문 전 매장에 문의해 주세요.</p>
          </> : <p>검색 조건을 변경하면 매장 정보를 확인할 수 있습니다.</p>}
        </aside>
      </div>
    </div>
  </main>;
}
