import { Monster } from './monster';
import mon1 from '../../../static/images/mon1.png';

export const Planet = () => {
  return (
    <div>
      <canvas id="planet"></canvas>
      <Monster img={mon1}></Monster>
    </div>
  );
};
