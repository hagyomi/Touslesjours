import Hero from '../../components/Hero';
import Menu from '../../components/Home/Menu';
import Gift from '../../components/Home/Gift';
import Picks from '../../components/Home/Picks';
import Event from '../../components/Home/Event';
import Story from '../../components/Home/Story';
import Store from '../../components/Home/Store';
import { getHomeProducts } from '../../services/homeService';
import './Home.css';

const { dailyPicks } = getHomeProducts();

export default function Home({ onSelect, onGift }) {
  return <main id="main-content" className="home">
    <Hero />
    <Menu onSelect={onSelect} />
    <Gift onSelect={onGift} />
    <Picks products={dailyPicks} onSelect={onSelect} />
    <Event onSelect={onSelect} />
    <Story />
    <Store />
  </main>;
}
