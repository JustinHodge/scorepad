import { useState } from 'react';
import { Modal, Button, Image, Nav, Tab, Row } from 'react-bootstrap';
import { CalculatorTab } from './components/calculator_tab/calculator_tab';
import DiceTab from './components/dice_tab/dice_tab';

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
                            setCurrentTab(key ?? TAB_KEYS.CALCULATOR);
                        }}
                    >
                        <Row>
                            <Nav variant='tabs'>
                                <Nav.Item>
                                    <Nav.Link eventKey={TAB_KEYS.CALCULATOR}>
                                        <Image
                                            className='button-icon'
                                            src='/calculator.svg'
                                        />
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey={TAB_KEYS.DICE}>
                                        <Image
                                            className='button-icon'
                                            src='/dice.svg'
                                        />
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Row>
                        <Row>
                            <Tab.Content>
                                <Tab.Pane eventKey={TAB_KEYS.CALCULATOR}>
                                    <CalculatorTab />
                                </Tab.Pane>
                                <Tab.Pane eventKey={TAB_KEYS.DICE}>
                                    <DiceTab />
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
