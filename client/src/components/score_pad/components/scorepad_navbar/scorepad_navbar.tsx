import { Navbar, Image, NavbarText, Button } from 'react-bootstrap';
import './scorepad_navbar.css';
import { useContext } from 'react';
import ScorepadContext from '../../../../contexts/score_pad';

export const ScorepadNavbar = () => {
    const { requestAddPlayer, requestLeaveExisting } =
        useContext(ScorepadContext);
    return (
        <Navbar sticky='top' bg='dark' className='px-2 shadow-lg'>
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
            <Navbar.Collapse role='navigation' className='justify-content-end'>
                <NavbarText className='px-2'>
                    <Button
                        onClick={() => {
                            requestAddPlayer(0);
                        }}
                    >
                        <Image className='button-icon' src='/add_profile.svg' />
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
                            className='button-icon'
                            src='/session_leave.svg'
                        />
                    </Button>
                </NavbarText>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default ScorepadNavbar;
