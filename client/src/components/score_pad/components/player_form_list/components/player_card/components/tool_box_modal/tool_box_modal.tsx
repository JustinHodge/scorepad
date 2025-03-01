import { useState } from 'react';
import { Modal, Button, Image, Nav, Tab, Row } from 'react-bootstrap';

const TAB_KEYS = { CALCULATOR: 'calculator ', DICE: 'dice' } as const;
const DEFAULT_TAB = TAB_KEYS.CALCULATOR;

export const ToolBoxModal = () => {
    const [show, setShow] = useState(false);
    const [currentTab, setCurrentTab] = useState<string>(DEFAULT_TAB);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant='secondary' onClick={handleShow}>
                <Image className='button-icon' src='/tool_box.svg' />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton />
                <Modal.Body>
                    <Tab.Container
                        activeKey={currentTab}
                        onSelect={(key) => {
                            const newTabKey = key as keyof typeof TAB_KEYS;
                            console.log(newTabKey);
                            console.log(TAB_KEYS[newTabKey]);
                            setCurrentTab(
                                TAB_KEYS[
                                    (key as keyof typeof TAB_KEYS) ?? ''
                                ] ?? TAB_KEYS.CALCULATOR
                            );
                        }}
                    >
                        <Row>
                            <Nav variant='tabs'>
                                <Nav.Item>
                                    <Nav.Link eventKey={TAB_KEYS.CALCULATOR}>
                                        Calculator
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey={TAB_KEYS.DICE}>
                                        Dice
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Row>
                        <Row>
                            <Tab.Content>
                                <Tab.Pane eventKey={TAB_KEYS.CALCULATOR}>
                                    Tab content for Calculator
                                </Tab.Pane>
                                <Tab.Pane eventKey={TAB_KEYS.DICE}>
                                    Tab content for Dice
                                </Tab.Pane>
                            </Tab.Content>
                        </Row>
                    </Tab.Container>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ToolBoxModal;
