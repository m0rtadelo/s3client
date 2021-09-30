import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/vercel-toast/dist/vercel-toast.css';
import { InitView } from './views/init/init.view';

window.onload = () => {
  new InitView();
};
