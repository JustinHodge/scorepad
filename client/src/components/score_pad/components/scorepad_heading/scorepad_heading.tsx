import { Container, Navbar, Image, NavbarText, Button } from 'react-bootstrap';
import './scorepad_heading.css';
import { useContext } from 'react';
import ScorepadContext from '../../../../contexts/score_pad';

export const ScorepadHeading = () => {
    const { requestAddPlayer, requestLeaveExisting } =
        useContext(ScorepadContext);
    return (
        <Navbar sticky='top'>
            <Container>
                <Navbar.Brand>
                    <Image
                        title='Click to copy shareable url'
                        className='header-image'
                        onPointerDown={() => {
                            const url = new URL(window.location.href);
                            navigator.clipboard.writeText(url.toString());
                            alert('Copied Url: ' + url.toString());
                        }}
                        src='/scorepad_logo.svg'
                        alt='logo'
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse className='justify-content-end'>
                    <NavbarText className='px-2'>
                        <Button
                            onClick={() => {
                                requestAddPlayer(0);
                            }}
                        >
                            <Image
                                className='header-image-small'
                                src='/add_profile.svg'
                            />
                        </Button>
                    </NavbarText>
                    <NavbarText className='px-2'>
                        <Button
                            variant='danger'
                            onClick={() => {
                                requestLeaveExisting();
                            }}
                        >
                            <Image
                                className='header-image-small'
                                src='/session_leave.svg'
                            />
                        </Button>
                    </NavbarText>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default ScorepadHeading;
