import { Card } from 'react-bootstrap';
import ew_dos from '../../asset/img/ew-dos.png';

function Home() {

    return (
        <div className="app-page">
            <div className="app-page-header">
                <h2>Energy Web DApp showcase</h2>
            </div>
            <h3>Description:</h3>
            <p>This is a simple DApp meant to showcase some of the peculiarities of the Energy Web ecosystem.</p>
            <figure className="figure">
                <img src={ew_dos} className="figure-img img-fluid rounded" alt="EW-Dos" />
                <figcaption className="figure-caption text-center">Energy Web Dos schema</figcaption>
            </figure>
        </div>
    );
}

export default Home;
