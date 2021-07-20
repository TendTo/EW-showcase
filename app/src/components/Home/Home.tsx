import { Card } from 'react-bootstrap';

function Home() {
    return (
        <Card>
            <Card.Img variant="top" />
            <Card.Body>
                <Card.Title>Energy Web DApp showcase</Card.Title>
                <Card.Text>
                    This is a simple DApp meant to showcase some of the peculiarities of the Energy Web ecosystem.
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default Home;
