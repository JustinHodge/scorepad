import { Container, Nav, Navbar } from 'react-bootstrap';
import ShareableHeader from './shareable_header/shareable_header';

export const ScorepadHeading = () => {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand>
                    <ShareableHeader />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse>
                    <Nav>
                        <Nav.Link href='#'>Home</Nav.Link>
                        <Nav.Link href='#'>Link</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default ScorepadHeading;
